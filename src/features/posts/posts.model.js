export default class PostsModel {
  constructor(
    id,
    userId,
    userInfo,
    title,
    description,
    imageUrl,
    likes,
    comments,
    createdAt
  ) {
    this.id = id;
    this.userId = userId;
    this.userInfo = userInfo;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.likes = likes;
    this.comments = comments;
    this.createdAt = createdAt;
  }
}
