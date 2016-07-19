//Seph Reed Copywrite
//January 2014
//This code retrieves the color codes for specific parts and them applies
//them to all elements listed under that part in elements_and_settings.json



//The Blam and Highlight Buttons Settings
function Button(id, offText, onText, sublistName)  {
    this.id = id;
    this.onText = onText;
    this.offText = offText;
    this.sublistName = sublistName;
    this.sublist = null;   
    this.element = null;
}


var blamButton = new Button("blam", "BLAM IT!", "UNBLAM IT", "black_list");
var highlightButton = new Button("highlight", "Highlight Site", "Unhighlight Site", "a_list");


var current_site;

window.addEventListener("load", init, false);
function init() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        current_site = arrayOfTabs[0].url;

        chrome.storage.local.get('black_list', function(result){
            if(result.black_list != null)  {  blamButton.sublist = result.black_list;  }
            else {  blamButton.sublist = [];  }

            initButton(blamButton);
        });


        chrome.storage.local.get('a_list', function(result){
            if(result.a_list != null)  {  highlightButton.sublist = result.a_list;  }
            else {  highlightButton.sublist = [];  }

            initButton(highlightButton);
        });
      
    });

    var ln = document.getElementById("title_bar");
    var location = ln.href;
    ln.onclick = function () {  
        chrome.tabs.create({active: true, url: location});  };
}


function initButton(button)  {
    button.element = document.getElementById(button.id);

    updateButton(button, false);
    button.element.addEventListener("mousedown", function()  {
        updateButton(button, true);  
    });
}



function updateButton(button, withFlip)  {
    var linkIndex = findMatchingLinkIndex(current_site, button.sublist);

    var buttonOn = (linkIndex != -1);
    
    if(withFlip == true) {
        if(buttonOn == false)  {
            var link = new Link(getSiteName(current_site));  
            button.sublist.push(link);
        }
        else {  button.sublist.splice(linkIndex, 1);  }

        buttonOn = !buttonOn;

        if(button.sublistName == "black_list")  {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {updateBlam: buttonOn}, function(response) {});
            });
            chrome.storage.local.set({ 'black_list' : button.sublist  }, function() {});   }
        else {
            chrome.storage.local.set({ 'a_list' : button.sublist  }, function() {});   }  
    }

    if(buttonOn == true)  {
        button.element.classList.add("engaged_button");
        button.element.textContent = button.onText;  }
    else  {
        button.element.classList.remove("engaged_button");
        button.element.textContent = button.offText;  }
}




function getSiteName(url)  {
    return url.match(/[\w-]+\.\w+(?=[\/\?\s]|$)/g)[0];
}






