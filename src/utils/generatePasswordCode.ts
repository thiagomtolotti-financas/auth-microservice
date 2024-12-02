export default function generatePasswordCode() {
  const oneHour = 1000 * 60 * 60;
  const expireTime = Date.now() + oneHour;
  const code = Math.floor(1000 + Math.random() * 9000);

  return { code, expireTime };
}
