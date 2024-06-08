let iframeVisible = false;
let responseEVisible = false;
let temp ;

let responseE = document.createElement('p');
responseE.id = 'geo-response';
responseE.textContent = 'Hi ...';
responseE.style.position = 'fixed';
responseE.style.top = 'calc(50% + 100px)';
responseE.style.left = '0';
responseE.style.margin = '0';
responseE.style.display = 'none';
responseE.style.zIndex = '9998';
document.body.insertBefore(responseE, document.body.firstChild);

let iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('map.html');
iframe.style.height = '200px';
iframe.style.width = '200px';
iframe.style.position = 'fixed';
iframe.style.top = 'calc(50% - 100px)';
iframe.style.left = '0';
iframe.style.zIndex = '9988';
iframe.style.border = 'none';
iframe.style.display = 'none';
iframe.style.backgroundColor = '#000000a0';
document.body.insertBefore(iframe, document.body.firstChild);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "responseCaptured") {
        temp = message;
        // console.log(message.data);
        drawAnswer(message.data);
        sendResponse({status: "success"});
    }
    if (message.action === 'toggleIFrame') {
        iframeVisible = !iframeVisible;
        updateVisible()
    }
    if (message.action === 'toggleCode') {
        responseEVisible = !responseEVisible;
        updateVisible()
    }
});

function drawAnswer(data) {
    let mapData = {
        lat: data.coord.lat,
        lon: data.coord.lon,
        code: data.code
    };
    // iframe.onload = () => {
        iframe.contentWindow.postMessage(mapData, '*');
    // };
    
}
function updateVisible(){
    if(iframeVisible){
        iframe.style.display = 'block';
        responseE.textContent = temp.data.metadata.street + " - " + temp.data.metadata.city;
    }else{
        iframe.style.display = 'none';
    }
    if(responseEVisible){
        responseE.style.display = 'block';
        responseE.textContent = temp.data.code;
    }else{
        responseE.style.display = 'none';
    }
}
