import ApiBuilder from "./apiBuilder.js";

// NOTE: jQuery ($) is loaded globally from index.html — we use it for DOM work


// =============================================================================
// SESSION
// Who is logged in? We store it in localStorage after login.
// =============================================================================

const SESSION_KEY = "gather-session";

function getSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function logoutAndRedirect() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "/auth.html";
}

// if there's no session at all, send the user to login
const session = getSavedSession();
if (!session || !session.token || !session.user) {
  window.location.href = "/auth.html";
}


// =============================================================================
// CURRENT USER & API
// =============================================================================

const currentUser = session.user;   // the logged-in user object { _id, firstName, lastName, email }
const authToken   = session.token;

// builds a fresh API client — we call this before each request
function getApiClient() {
  return new ApiBuilder({ token: authToken });
}


// =============================================================================
// DATA  — all the data we get from the server is stored here
// =============================================================================

let allConversations = [];   // array of conversation objects
let allFriends       = [];   // array of friend user objects
let loadedMessages   = {};   // object like { "conv123": [ msg, msg, ... ] }
let openConvId       = null; // the id of the conversation the user has open right now
let onlineUserIds    = [];   // array of userId strings currently connected to the server
                             // populated by the 'onlineUsers' socket event


// =============================================================================
// HELPER FUNCTIONS  — small reusable utilities
// =============================================================================

// Returns the full display name of a user, e.g. "John Doe"
function getFullName(user) {
  var firstName = user && user.firstName ? user.firstName : "";
  var lastName  = user && user.lastName  ? user.lastName  : "";
  var fullName  = (firstName + " " + lastName).trim();
  return fullName || "Unknown User";
}

// Returns 2 capital initials for the avatar circle, e.g. "JD"
function getInitials(user) {
  var name   = getFullName(user);
  var parts  = name.split(" ");
  var result = "";
  for (var i = 0; i < parts.length && i < 2; i++) {
    if (parts[i][0]) result += parts[i][0];
  }
  return result.toUpperCase();
}

// Returns the _id string from either a user object or a plain id string
function getUserId(value) {
  if (value && typeof value === "object") {
    return value._id || value.id || null;
  }
  return value;
}

// Returns a formatted time string "HH:MM" from a date string
function formatTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Looks up a user object by their id
// Searches: current user, friends list, and participants of all conversations
function findUserById(targetId) {
  // check if it's me
  if (getUserId(currentUser) === targetId) return currentUser;

  // check friends
  for (var i = 0; i < allFriends.length; i++) {
    if (getUserId(allFriends[i]) === targetId) return allFriends[i];
  }

  // check participants in conversations
  for (var c = 0; c < allConversations.length; c++) {
    var participants = allConversations[c].participants || [];
    for (var p = 0; p < participants.length; p++) {
      if (getUserId(participants[p]) === targetId) return participants[p];
    }
  }

  return { firstName: "Unknown", lastName: "User" };
}

// Returns the other person (not me) in a direct conversation
function getOtherPersonInConv(conv) {
  var participants = conv.participants || [];
  var myId = getUserId(currentUser);
  for (var i = 0; i < participants.length; i++) {
    if (getUserId(participants[i]) !== myId) {
      return findUserById(getUserId(participants[i]));
    }
  }
  return { firstName: "Unknown", lastName: "User" };
}

// Returns what title to show for a conversation
// — uses conv.name for group chats, or the other person's name for direct
function getConvTitle(conv) {
  if (conv.name) return conv.name;
  return getFullName(getOtherPersonInConv(conv));
}

// Extracts the friends array from the API response
// (API sometimes returns an array, sometimes { friends: [...] })
function extractFriendsList(apiResponse) {
  if (Array.isArray(apiResponse)) return apiResponse;
  if (apiResponse && Array.isArray(apiResponse.friends)) return apiResponse.friends;
  return [];
}


// =============================================================================
// RENDER FUNCTIONS  — each one returns an HTML string for one item
// =============================================================================

// Returns the HTML for one person card shown in search results
// Called once per result when we loop over searchResults
function buildPersonCardHtml(user) {
  var userId   = getUserId(user);
  var initials = getInitials(user);
  var name     = getFullName(user);
  var email    = user.email || "";

  return `
    <div class="person-row">
      <span class="avatar avatar--sm">${initials}</span>
      <span class="person-name">
        ${name}
        <small>${email}</small>
      </span>
      <div class="person-actions">
        <button class="btn btn--sm btn--ghost"   data-add-friend="${userId}">+ Friend</button>
        <button class="btn btn--sm btn--primary"  data-start-conv="${userId}">Message</button>
      </div>
    </div>`;
}

// Returns the HTML for one row in the conversations sidebar list
// Called once per conversation when we loop over allConversations
function buildConvRowHtml(conv) {
  var other    = getOtherPersonInConv(conv);
  var initials = getInitials(other);
  var title    = getConvTitle(conv);
  var isActive = conv._id === openConvId;

  // show the last message as a preview, or just "Direct" / "Group"
  var convMessages = loadedMessages[conv._id] || [];
  var preview = "";
  if (convMessages.length > 0) {
    preview = convMessages[convMessages.length - 1].content || "";
  } else {
    preview = conv.type === "group" ? "Group" : "Direct";
  }

  var activeClass = isActive ? "conv-item--active" : "";

  return `
    <button class="conv-item ${activeClass}" data-conv="${conv._id}">
      <span class="avatar">${initials}</span>
      <span class="conv-item-info">
        <strong>${title}</strong>
        <small>${preview}</small>
      </span>
    </button>`;
}

// Returns the HTML for one message bubble in the chat
// Called once per message when we loop over loadedMessages[convId]
function buildMessageHtml(msg) {
  var senderId = getUserId(msg.sender) || msg.senderId;
  var sender   = (msg.sender && typeof msg.sender === "object") ? msg.sender : findUserById(senderId);
  var isMine   = senderId === getUserId(currentUser);
  var cssClass = isMine ? "msg msg--mine" : "msg";

  return `
    <article class="${cssClass}">
      <strong>${getFullName(sender)}</strong>
      <p>${msg.content || msg.text || ""}</p>
      <time>${formatTime(msg.createdAt)}</time>
    </article>`;
}


// =============================================================================
// UI UPDATE FUNCTIONS  — each one updates one part of the page
// =============================================================================

// Fills in the sidebar (name, avatar, counters)
function refreshSidebar() {
  $("#user-avatar").text(getInitials(currentUser));
  $("#user-name").text(getFullName(currentUser));
  $("#user-email").text(currentUser.email || "");
  $("#conv-count").text(allConversations.length);
  $("#friend-count").text(allFriends.length);
}

// Re-builds the conversation list panel on the left
function refreshConversationList() {
  $("#conv-count-panel").text(allConversations.length);

  if (allConversations.length === 0) {
    $("#conv-list").html('<div class="empty-hint">No conversations yet.</div>');
    return;
  }

  // build HTML by looping over each conversation
  var html = "";
  for (var i = 0; i < allConversations.length; i++) {
    html += buildConvRowHtml(allConversations[i]);
  }
  $("#conv-list").html(html);

  // attach a click handler to each conversation button
  $("#conv-list [data-conv]").on("click", function() {
    var convId = $(this).data("conv");
    openConversation(convId);
  });
}

// Shows the message panel for the given conversation object
function showConversationMessages(conv) {
  var other    = getOtherPersonInConv(conv);
  var initials = getInitials(other);
  var title    = getConvTitle(conv);
  var type     = conv.type === "group" ? "Group" : "Direct";

  // hide the "select a conversation" placeholder, show the real panel
  $("#msg-empty").hide();
  $("#msg-panel-content").css("display", "flex");

  // fill in the header
  $("#msg-header").html(`
    <span class="avatar">${initials}</span>
    <div>
      <p class="eyebrow">${type}</p>
      <h2>${title}</h2>
    </div>
  `);

  // build the messages HTML
  var convMessages = loadedMessages[conv._id] || [];
  if (convMessages.length === 0) {
    $("#msg-list").html('<div class="empty-hint">No messages yet. Say hi!</div>');
  } else {
    var html = "";
    for (var i = 0; i < convMessages.length; i++) {
      html += buildMessageHtml(convMessages[i]);
    }
    $("#msg-list").html(html);
  }

  // scroll to the bottom so latest messages are visible
  var msgList = document.getElementById("msg-list");
  msgList.scrollTop = msgList.scrollHeight;
}

// Shows or hides the search results panel
function showSearchResults(results, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) {
    $("#search-results").hide();
    return;
  }

  if (results.length === 0) {
    $("#search-results").html(`<p class="empty-hint">No users found for "${searchQuery}"</p>`).show();
    return;
  }

  // build results HTML by looping over each result
  var html = '<p class="eyebrow">People</p>';
  for (var i = 0; i < results.length; i++) {
    html += buildPersonCardHtml(results[i]);
  }
  $("#search-results").html(html).show();

  // attach button listeners
  $("#search-results [data-add-friend]").on("click", function() {
    addFriend($(this).data("add-friend"));
  });
  $("#search-results [data-start-conv]").on("click", function() {
    startConversation($(this).data("start-conv"));
  });
}

// Shows an error message at the top of the page
function showError(message) {
  $("#toast-msg").text(message);
  $("#toast").show();
}

// Hides the error message
function hideError() {
  $("#toast").hide();
}


// =============================================================================
// ACTIONS  — talk to the API, store the result, then refresh the UI
// =============================================================================

// Loads all conversations + friends when the page first opens
async function loadAllData() {
  try {
    var apiClient    = getApiClient();
    var convData     = await apiClient.conversations.getAll();
    var friendsData  = await apiClient.friends.getAll();

    allConversations = Array.isArray(convData) ? convData : [];
    allFriends       = extractFriendsList(friendsData);

    refreshSidebar();
    refreshConversationList();

  } catch (error) {
    if (error.message.toLowerCase().includes("unauthori")) {
      logoutAndRedirect();
      return;
    }
    showError(error.message);
  }
}

// Opens a conversation: fetches its messages from the API then displays them
async function openConversation(convId) {

  // ── Room switching ───────────────────────────────────────────────────────
  // If the user is switching from one conversation to another, use 'switchRoom'
  // so the server atomically leaves the old room and joins the new one in a
  // single event (no gap where we might be in both rooms at once).
  //
  // If this is the very FIRST conversation the user opens (openConvId is null),
  // use 'joinRoom' because there is no old room to leave.
  if (openConvId && openConvId !== convId) {
    // socket.emit('switchRoom', payload)
    //   → tells the server: "leave fromConvId, join toConvId — atomically"
    socket.emit('switchRoom', {
      fromConvId: openConvId, // the room we are currently in
      toConvId:   convId      // the room we want to be in
    });
  } else if (!openConvId) {
    // First conversation — just join, nothing to leave
    // socket.emit('joinRoom', payload)
    //   → tells the server: "add me to this conversation's Socket.IO room"
    socket.emit('joinRoom', {
      conversationId: convId,
      userId: getUserId(currentUser)
    });
  }

  openConvId = convId;
  refreshConversationList(); // re-draw to highlight the active conversation

  try {
    var apiClient      = getApiClient();
    var messagesData   = await apiClient.messages.getByConversation(convId);
    loadedMessages[convId] = Array.isArray(messagesData) ? messagesData : [];
  } catch (error) {
    showError(error.message);
  }

  // find the conversation object and show its messages
  for (var i = 0; i < allConversations.length; i++) {
    if (allConversations[i]._id === convId) {
      showConversationMessages(allConversations[i]);
      break;
    }
  }
}

// Creates a new direct conversation with someone from the search results
async function startConversation(participantId) {
  hideError();
  try {
    var apiClient = getApiClient();
    var newConv   = await apiClient.conversations.createDirect(participantId);

    if (newConv && newConv._id) {
      // add it to our local list if it's not there yet
      var alreadyExists = false;
      for (var i = 0; i < allConversations.length; i++) {
        if (allConversations[i]._id === newConv._id) {
          alreadyExists = true;
          break;
        }
      }
      if (!alreadyExists) allConversations.unshift(newConv);

      // clear the search box
      $("#search-input").val("");
      showSearchResults([], "");
      refreshConversationList();
      await openConversation(newConv._id);
    }
  } catch (error) {
    showError(error.message);
  }
}

// Adds a user as a friend, then reloads the friends list
async function addFriend(friendUserId) {
  hideError();
  try {
    var apiClient  = getApiClient();
    await apiClient.friends.add(friendUserId);

    // reload friends from the server so we get populated user objects
    var freshData = await apiClient.friends.getAll();
    allFriends    = extractFriendsList(freshData);

    refreshSidebar();
    $("#search-input").val("");
    showSearchResults([], "");
  } catch (error) {
    showError(error.message);
  }
}

// Sends a message in the currently open conversation
async function sendMessage(messageText) {
  if (!openConvId || !messageText.trim()) return;
  try {
    var apiClient = getApiClient();

    // ── Step 1: Persist via REST API ─────────────────────────────────────
    // We always save the message to the DB first through the REST endpoint.
    // This guarantees it is stored even if the other user is currently offline.
    var newMsg = await apiClient.messages.send(openConvId, messageText.trim());

    // ── Step 2: Update local state ───────────────────────────────────────
    // Add the saved message to our in-memory cache so OUR UI updates
    // immediately without waiting for a socket echo.
    if (!loadedMessages[openConvId]) loadedMessages[openConvId] = [];
    loadedMessages[openConvId].push(newMsg);

    // find the active conversation and refresh the message panel
    for (var i = 0; i < allConversations.length; i++) {
      if (allConversations[i]._id === openConvId) {
        showConversationMessages(allConversations[i]);
        break;
      }
    }

    // ── Step 3: Broadcast via Socket.IO ─────────────────────────────────
    // socket.emit('sendMessage', payload)
    //   → sends to the SERVER, which then relays it to all OTHER sockets
    //   in the same room (socket.to(room).emit('newMessage', ...)).
    //   We do this AFTER the REST call so `newMsg` has the full DB object
    //   (including _id, createdAt, populated sender, etc.).
    socket.emit('sendMessage', {
      conversationId: openConvId, // the room to broadcast to
      message: newMsg             // the full saved message from the API response
    });

  } catch (error) {
    showError(error.message);
  }
}

// Searches for users by name/email and shows the results
async function searchForUsers(query) {
  if (!query || !query.trim()) {
    showSearchResults([], "");
    return;
  }
  try {
    var apiClient = getApiClient();
    var results   = await apiClient.users.search(query);
    showSearchResults(Array.isArray(results) ? results : [], query);
  } catch (error) {
    showError(error.message);
  }
}


// =============================================================================
// EVENT LISTENERS  — user interactions, all grouped here at the bottom
// =============================================================================

// logout button
$("#btn-logout").on("click", function() {
  logoutAndRedirect();
});

// dismiss error toast
$("#dismiss-toast").on("click", function() {
  hideError();
});

// search box — wait 300ms after typing stops before hitting the API
var searchTypingTimer;
$("#search-input").on("input", function() {
  var query = $(this).val();
  clearTimeout(searchTypingTimer);
  searchTypingTimer = setTimeout(function() {
    searchForUsers(query);
  }, 300);
});

// send message form
$("#msg-form").on("submit", function(e) {
  e.preventDefault();
  var text = $("#msg-input").val();
  sendMessage(text);
  $("#msg-input").val("");
});


// =============================================================================
// SOCKET.IO — real-time layer
// =============================================================================
//
// HOW THE CLIENT SIDE WORKS
// ─────────────────────────
// `io()` — global function injected by /socket.io/socket.io.js (loaded in index.html).
//   Calling it with no args connects to the SAME server that served the page.
//   It returns a `socket` object that represents THIS browser's connection.
//
// socket.emit(event, data)
//   → sends an event FROM the browser TO the server
//
// socket.on(event, handler)
//   → listens for an event coming FROM the server TO this browser

// ── 1. CONNECT ──────────────────────────────────────────────────────────────
// io() contacts the server at the current origin (same host + port as the page).
// Socket.IO automatically tries WebSocket first, falls back to polling if needed.
var socket = io(); // `socket` is our live connection — we use it everywhere below

// ── 2. LISTEN: connect ──────────────────────────────────────────────────────
// Socket.IO fires the built-in 'connect' event on the client once the
// WebSocket handshake is complete and we are ready to send/receive events.
socket.on('connect', function () {
  console.log('[Socket.IO] ✅ Connected to server | socket.id =', socket.id);

  // ── Announce ourselves to the server ──────────────────────────────────
  // socket.emit('userOnline', payload)
  //   → tells the server which DB user this socket belongs to.
  //   The server stores userId → socketId in its presence Map and then
  //   broadcasts the updated online list to everyone.
  socket.emit('userOnline', {
    userId: getUserId(currentUser) // our DB _id from the session
  });
});

// ── 3. LISTEN: onlineUsers ────────────────────────────────────────────────
// The server emits 'onlineUsers' to EVERYONE (io.emit) whenever someone
// connects or disconnects.  We receive the full fresh list each time.
socket.on('onlineUsers', function (data) {
  // data = { userIds: [ "abc", "def", ... ] }
  onlineUserIds = data.userIds; // replace our local copy with the latest list

  // (optional) log so you can see presence changes in the browser console
  console.log('[Socket.IO] 🟢 Online users:', onlineUserIds);

  // TODO: when you add online indicators to the UI (green dots etc.),
  // call a refresh function here, e.g. refreshFriendsList().
  // For now we just store the list so other code can read it.
});

// ── 4. LISTEN: joinedRoom ───────────────────────────────────────────────────
// The server emits 'joinedRoom' back ONLY to us (socket.emit on server side)
// to confirm we are now inside the conversation room.
// This fires for both 'joinRoom' and 'switchRoom' events.
socket.on('joinedRoom', function (data) {
  // data = { conversationId, message }
  console.log('[Socket.IO] 📥 In room:', data.conversationId, '|', data.message);
});

// ── 5. LISTEN: newMessage ────────────────────────────────────────────────────
// The server emits 'newMessage' to everyone in the room EXCEPT the sender.
// So we receive this only when SOMEONE ELSE sends a message.
socket.on('newMessage', function (data) {
  // data = { conversationId, message }
  var convId = data.conversationId; // which conversation this message belongs to
  var msg    = data.message;        // the full message object from the DB

  // store the incoming message in our local cache
  if (!loadedMessages[convId]) loadedMessages[convId] = [];
  loadedMessages[convId].push(msg);

  // re-draw the conversation list so the preview text updates
  refreshConversationList();

  // if the message belongs to the conversation the user is currently viewing,
  // re-render the message panel so the new bubble appears immediately
  if (convId === openConvId) {
    for (var i = 0; i < allConversations.length; i++) {
      if (allConversations[i]._id === convId) {
        showConversationMessages(allConversations[i]);
        break;
      }
    }
  }
});

// ── 6. LISTEN: disconnect ───────────────────────────────────────────────────
// Socket.IO fires the built-in 'disconnect' event when the connection drops
// (e.g. server restart, no internet).  Socket.IO will auto-reconnect by default.
socket.on('disconnect', function (reason) {
  // reason is a string like "transport close" or "ping timeout"
  console.log('[Socket.IO] ❌ Disconnected from server | reason:', reason);
});


// =============================================================================
// START  — fill in the page and load data from the server
// =============================================================================

refreshSidebar();
loadAllData();
