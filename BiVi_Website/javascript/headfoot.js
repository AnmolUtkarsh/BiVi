async function load(id, path) {
    const response = await fetch(path);

    if (!response.ok) {
        console.error(`Failed to load ${path}: ${response.status}`);
        return;
    }

    document.getElementById(id).innerHTML = await response.text();
}

load("header", "components/header.html");
load("footer", "./components/footer.html");