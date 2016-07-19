







var black_domNode = ID("the_black_list");
var a_domNode = ID("the_a_list");

var black_btn = ID("black_list_btn");
var a_btn = ID("a_list_btn");

var blam_addBtn = ID("blam_add_item");
var a_addBtn = ID("highlight_add_item");

var blam_addText = ID('blam_add_me');
var a_addText = ID('highlight_add_me');


window.onload = function(e){ 


    black_btn.addEventListener("click", function() {
    	black_btn.classList.add("button_on");
    	a_btn.classList.remove("button_on");

    	black_domNode.style.display = "block";
    	a_domNode.style.display = "none";
    });



    a_btn.addEventListener("click", function() {
    	a_btn.classList.add("button_on");
    	black_btn.classList.remove("button_on");

    	a_domNode.style.display = "block";
    	black_domNode.style.display = "none";
    });



    blam_addText.onkeypress=function(e){
	    if(e.keyCode==13) blam_addBtn.click();
	}

	
	blam_addBtn.addEventListener("click", function()  {
			//
		var url = blam_addText.value;
		if(!url || !url.length)
			return;

		var link = new Link(url);  
        black_list.push(link);

		chrome.storage.local.set({ 'black_list' : black_list  }, function() {}); 

		addItem(link, black_list);
	});

	a_addText.onkeypress=function(e){
	    if(e.keyCode==13) a_addBtn.click();
	}

	
	a_addBtn.addEventListener("click", function()  {	
			//
		var url = a_addText.value;
		if(!url || !url.length)
			return;

		var link = new Link(url);  
        a_list.push(link);

		chrome.storage.local.set({ 'a_list' : a_list  }, function() {}); 

		addItem(link, a_list);
	});
}








var black_list;
chrome.storage.local.get('black_list', function(result)  {
	black_list = result.black_list || [];
	console.log("BLACK_LIST", black_list)
	displayList(black_list);
});


var a_list;
chrome.storage.local.get('a_list', function(result)  {

	a_list = result.a_list || [];
	console.log("A_LIST", a_list)
	displayList(a_list);
});



function displayList(list)  {
	for(var i = 0; i < list.length; i++)  {
		addItem(list[i], list);
	}
}







function addItem(link, list) {
	var blackNotA = list == black_list;
	var url = link.url;

	var listItem = document.createElement("DIV");
	listItem.name = url;
	listItem.classList.add("list_item");

	var button = document.createElement("BUTTON");
	button.textContent = "x";
	button.name = url;
	button.className = "unblock_item";

	listItem.appendChild(button);

	var span = document.createElement("SPAN");
	span.textContent = url;

	if(list == a_list)  {
		span.classList.add("good_link");  }

	listItem.appendChild(span);

	console.log("addItem", a_addText);

	if(blackNotA) {
		blam_addText.parentNode.insertBefore(listItem, blam_addText.nextSibling);  }
	else {
		console.log(a_addText);
		a_addText.parentNode.insertBefore(listItem, a_addText.nextSibling);  }

	var buttons = listItem.getElementsByTagName("BUTTON");
	buttons[0].addEventListener("click", function() {
		
		var target = list.indexOf(link);
		if(target != -1)
			list.splice(target, 1);
		else
			console.log("ERR: removing unfindable link");
	
		if(blackNotA) {
			chrome.storage.local.set({ 'black_list' : list  }, function() {});  }
		else {
			chrome.storage.local.set({ 'a_list' : list  }, function() {});  }

        var container = this.parentNode;
        container.parentNode.removeChild(container);
    
	});
}


















