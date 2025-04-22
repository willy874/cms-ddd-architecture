export default defineEventHandler(async (event) => {
  return "dynamic: " + event.path;
});
