const { asyncHandler } = require('../utils/asyncHandler');
const commentsService = require('../services/comments.service');

const addComment = asyncHandler(async (req, res) => {
  const comment = await commentsService.addComment({
    taskId: req.params.taskId,
    ownerId: req.user.id,
    authorId: req.user.id,
    body: req.body.body,
  });
  res.status(201).json({ comment });
});

const listComments = asyncHandler(async (req, res) => {
  const comments = await commentsService.listComments({
    taskId: req.params.taskId,
    ownerId: req.user.id,
  });
  res.json({ comments });
});

const deleteComment = asyncHandler(async (req, res) => {
  const result = await commentsService.deleteComment({
    taskId: req.params.taskId,
    commentId: req.params.commentId,
    ownerId: req.user.id,
    requesterId: req.user.id,
  });
  res.json(result);
});

module.exports = { addComment, listComments, deleteComment };

