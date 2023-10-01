export class NotiMessageDto {
  constructor(
    public userId: number,
    public postId: number,
    public title: string,
  ) {}
}
