export default async image => {
  if (/^\/\_nuxt\//.test(image)) {
    return image;
  }
  
  const url = await require(`@/avatars/${image}`);

  return /^\/\_nuxt\//.test(url) ? url : "";
}