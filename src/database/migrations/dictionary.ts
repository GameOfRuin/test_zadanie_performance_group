export enum Tables {
  articles = 'articles',
  users = 'users',
}

export enum Columns {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',

  name = 'name',
  email = 'email',
  password = 'password',

  title = 'title',
  tags = 'tags',
  description = 'description',
  text = 'text',

  authorId = 'authorId',

  visibility = 'visibility',
}
export enum Visibility {
  public = 'public',
  private = 'private',
}
