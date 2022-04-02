export default async function me(
  parent: any,
  args: any,
  context: any
): Promise<{ _id: String; username: String; email: String } | null> {
  if (!context.req.user) return null;
  return context.req.user;
}
