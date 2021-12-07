
document.getElementById('hallista').onclick = fishList2HTML;

async function fishList2HTML(){
    const response = await fetch("halak");
    const halak = await response.json();

    
    let fishTable='<table id="myfishTable"><tr><th>Hal fajtája</th><th>Kifogás időpontja</th><th>Tömege(gramm)</th></tr>';
    for( const egyHal of halak){
        fishTable += `<tr><td>${egyHal.fajta}</td><td>${egyHal.datum}</td><td>${egyHal.tomeg}</td></tr>`;
    }
    fishTable += '</table>';    

    document.getElementById('fogasok').innerHTML = fishTable;
}

document.getElementById("newFish").onsubmit = async function (event) {
    event.preventDefault();
    const fajta = event.target.elements.fajta.value;
    const tomeg = event.target.elements.tomeg.value;
    const datum = event.target.elements.datum.value;

    
    const res = await fetch("/halak", {
        method: 'POST',
        headers: {
            "content-type" : "application/json",
        },
        body: JSON.stringify({
            fajta,
            tomeg,
            datum

        }),
    });

    fishList2HTML();
    
};

