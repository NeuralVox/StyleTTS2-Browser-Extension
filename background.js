chrome.contextMenus.create({
    id: 'STTS2CRX1',
    title: 'Read Aloud',
    type: 'normal',
    contexts: ['selection']
})
chrome.contextMenus.onClicked.addListener((item, tab) => {
    var id = item.menuItemId
    if (id == 'STTS2CRX1') {
        console.log('Reading')
        var text = item.selectionText;
        console.log(text)
        chrome.storage.local.set({ texttoanalyze: text })
        try {
            chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            }, ([tab]) => {
                chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id
                    },
                    function: function () {
                        chrome.storage.local.get('texttoanalyze').then((texttoanalyze) => {
                            text = texttoanalyze['texttoanalyze'];
                            console.log('StyleTTS 2 is reading:')
                            console.log(text)
                            // Create loading modal
                            var speakingModal = document.createElement("div");
                            speakingModal.style.boxSizing = "border-box";
                            speakingModal.style.position = "sticky";
                            speakingModal.style.margin = "0";
                            speakingModal.style.background = "white";
                            speakingModal.style.bottom = "15px";
                            speakingModal.style.marginLeft = "20px";
                            speakingModal.style.marginRight = "20px";
                            speakingModal.style.boxShadow = "0 0.05em 0.5em -0.125em rgba(10, 10, 10, 0.7), 0 0px 0 1px rgba(10, 10, 10, 0.02)";
                            speakingModal.style.borderRadius = "7px";
                            speakingModal.style.padding = "10px";
                            speakingModal.style.display = "flex";
                            speakingModal.style.alignItems = "center";
                            speakingModal.style.zIndex = "999999999999999999999999999999999999999999";

                            var speakingText = document.createElement("span");
                            speakingText.innerText = "Synthesizing text...";
                            speakingText.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
                            speakingText.style.textAlign = "center";
                            speakingText.style.flexGrow = "1";
                            speakingText.style.fontWeight = "bold";

                            speakingModal.appendChild(speakingText);
                            document.body.appendChild(speakingModal);
                            const apiUrl = 'https://styletts2-community-stts2-api.hf.space/api';

                            fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ text: text }),
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        speakingModal.remove();
                                        alert('Speaking failed. Please try again.');
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.arrayBuffer();
                                })
                                .then(data => {
                                    speakingModal.remove();

                                    // Create element
                                    var audioModal = document.createElement("div");
                                    audioModal.style.boxSizing = "border-box";
                                    audioModal.style.position = "sticky";
                                    audioModal.style.margin = "0";
                                    audioModal.style.background = "white";
                                    audioModal.style.bottom = "15px";
                                    audioModal.style.marginLeft = "20px";
                                    audioModal.style.marginRight = "20px";
                                    audioModal.style.boxShadow = "0 0.05em 0.5em -0.125em rgba(10, 10, 10, 0.7), 0 0px 0 1px rgba(10, 10, 10, 0.02)";
                                    audioModal.style.borderRadius = "7px";
                                    audioModal.style.padding = "10px";
                                    audioModal.style.display = "flex";
                                    audioModal.style.alignItems = "center";
                                    audioModal.style.zIndex = "999999999999999999999999999999999999999999";

                                    var audioElement = document.createElement("audio");
                                    audioElement.src = "";
                                    audioElement.controls = true;
                                    audioElement.style.flexGrow = "1";
                                    audioElement.style.height = "40px";

                                    var closeButton = document.createElement("div");
                                    closeButton.style.display = "flex";
                                    closeButton.style.alignItems = "center";
                                    closeButton.style.justifyContent = "center";
                                    closeButton.style.background = "#272727";
                                    closeButton.style.padding = "5px";
                                    closeButton.style.borderRadius = "5px";
                                    closeButton.style.marginLeft = "10px";
                                    closeButton.style.cursor = "pointer";

                                    var closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                                    var closePath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                    closeIcon.setAttribute("viewBox", "0 -960 960 960");
                                    closePath.setAttribute('d', 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
                                    closeIcon.appendChild(closePath);
                                    closeIcon.style.width = '25px';
                                    closeIcon.style.height = '25px';
                                    closeIcon.style.fill = 'white';

                                    closeButton.appendChild(closeIcon);

                                    audioModal.appendChild(audioElement);
                                    audioModal.appendChild(closeButton);
                                    document.body.appendChild(audioModal);
                                    closeButton.addEventListener('click', function(e) {
                                        audioModal.remove();
                                    })
                                    const audioBlob = new Blob([data], { type: 'audio/mpeg' });
                                    const audioUrl = URL.createObjectURL(audioBlob);

                                    // const audioElement = new Audio(audioUrl);
                                    // console.log(audioUrl);
                                    // const audioElement = document.getElementById('audio');
                                    audioElement.src = audioUrl;
                                    audioElement.play();
                                })
                                .catch(error => {
                                    speakingModal.remove();
                                    alert('Speaking failed. Please try again.');
                                    console.error('Error:', error);
                                });
                        })
                    }
                })
            })
        } catch (e) {
            console.warn(e);
        }
    }
})
