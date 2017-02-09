if(document.getElementById("newEx")){
	document.getElementById("newEx").addEventListener("click", function(event){
		console.log("Clicked submit");
		
		var req = new XMLHttpRequest();
		var info = {};
		info.name = document.getElementById("nName").value;
		if(info.name.length < 1){
			return;
		}
		info.reps = document.getElementById("nReps").value;
		info.weight = document.getElementById("nWeight").value;
		info.date = document.getElementById("nDate").value;
		if(info.date.length < 1){
			return;
		}
		info.lbs = document.getElementById("nLbs").value;
		
		
		req.open("POST", "/insert", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener("load", function(){
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				console.log("Request received")
				console.log(response);
				var count = response.results.length-1;
				var row = document.createElement("tr");
				for(var p in response.results[count]){
					if(p !== "id"){
						var col = document.createElement("td");
						col.textContent = response.results[count][p];
						row.appendChild(col);
					}
				}	
					var btnCol= document.createElement("td");
					var form = document.createElement("form");
						form.method="POST";
						form.id="updForm";
						form.action="/update";
					var hInput = document.createElement("input");
						hInput.name="id";
						hInput.type = "hidden";
						hInput.value=response.results[count].id;
					form.appendChild(hInput);
					var upBtn = document.createElement("input");
						upBtn.type="submit";
						upBtn.id="btnUp";
						upBtn.value="Update";
					form.appendChild(upBtn);
					btnCol.appendChild(form);
					var delForm = document.createElement("form");
						delForm.method="POST";
						delForm.id="delForm";
						delForm.action="/";
					var hdInput = document.createElement("input");
						hdInput.name="id";
						hdInput.type = "hidden";
						hdInput.value=response.results[count].id;
					delForm.appendChild(hdInput);
					var delBtn = document.createElement("input");
						delBtn.type="submit";
						delBtn.id="aBtnDel";
						delBtn.value="Delete";
						delBtn.onclick = function(){delRows(this, hInput.value);};
					delForm.appendChild(delBtn);
					btnCol.appendChild(delForm);
					row.appendChild(btnCol);
					row.className = "row" + hInput.value;
					document.getElementById("tables").appendChild(row);
				
			}});
		req.send(JSON.stringify(info));
		
		event.preventDefault();
	});
}

function delRows(val, id){
	var row = val.parentNode.parentNode.parentNode;
	row.parentNode.removeChild(row);
	var req = new XMLHttpRequest();
	var info = {};
	info.id=id;
	req.open("POST", "/remove", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify(info));
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			
		}});
	event.preventDefault();
}



if(document.getElementById("updateDataButton")){
	document.getElementById("updateDataButton").addEventListener("click", function(event){
		
		var req = new XMLHttpRequest();
		var info = {};
		info.id = document.getElementById("uId").value;
		info.name = document.getElementById("uName").value;
		if(info.name.length < 1){
			return;
		}	
		info.reps = document.getElementById("uReps").value;
		info.weight = document.getElementById("uWeight").value;
		info.date = document.getElementById("uDate").value;
		if(info.date.length < 1){
			return;
		}
		info.lbs = document.getElementById("uLbs").value;
		
		req.open("POST", "/pushUpdate" , true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify(info));
		
		
	
	});
}


