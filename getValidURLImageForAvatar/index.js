export default async image => {
  const url = await require(`@/avatars/${image}`);

  return /^\/\_nuxt\//.test(url) ? url : "";
}