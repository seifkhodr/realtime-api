import User from '../model/user.model.js';
import catchAsyncWrapper from '../middleware/catchAsyncWrapper.middleware.js';
import { httpResponseSuccessCode } from '../utils/enums/httpResponseStatusCode.js';
import { httpSuccessResponse } from '../utils/httpResponseFormatter.js';

const searchUsers = catchAsyncWrapper(async (req, res) => {
	const searchQuery = String(req.query.q || '').trim();
	const users = searchQuery ? await User.find({
		_id: { $ne: req.user.id },
		$or: [
			{ firstName: { $regex: searchQuery, $options: 'i' } },
			{ lastName: { $regex: searchQuery, $options: 'i' } },
			{ email: { $regex: searchQuery, $options: 'i' } }
		]
	}).select('firstName lastName email') : [];

	return res.status(httpResponseSuccessCode.OK).json(httpSuccessResponse(users));
});

export default { searchUsers };
