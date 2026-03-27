const API_KEY = "AIzaSyCpMlF-MZ-cr7lNZsPRL_K1WYM4Lg0QywE";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function test() {
  const req = await fetch(url);
  const res = await req.json();
  if (res.error) {
    console.log("Error:", res.error.message);
  } else {
    console.log("Models length:", res.models.length);
    console.log(res.models.map(m => m.name).join("\\n"));
  }
}

test();
