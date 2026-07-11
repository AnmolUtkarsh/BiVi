async function load(id, path) {
    document.getElementById(id).innerHTML =
        await (await fetch(path)).text();
}

load("header", "http://127.0.0.1:3000/BiVi_Website/components/header.html");
load("footer", "http://127.0.0.1:3000/BiVi_Website/components/footer.html");