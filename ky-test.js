import got from 'got';

const imageUrl =
  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

const result = await got.get(imageUrl);

// const img = Buffer.from(result.rawBody, 'binary').toString('base64');
const img = result.rawBody.toString('base64');
console.log(img);

// const fr = new FileReader();
// fr.onload = function () {
//   console.log(this.result);
// };
// fr.read
// result.raw
// const blob = new Blob()
