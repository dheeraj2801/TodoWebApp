const inputBox = document.querySelector(".input-field input");
const addBtn = document.querySelector(".input-field button");

// inputBox.onkeyup =() => {
//     let userdata = inputBox.value;
//     if(userdata.trim()!=0){
//         addBtn.classList.add("active");
//     }
//     else{
//         addBtn.classList.remove("active");
//     }
// }

function warning(){
	let userdata = inputBox.value;
	console.log(userdata);
	if(userdata.trim()==0){
		window.alert("Add Your Todo!!!")
	}
}

// addBtn.onClick = () =>{
//     let userdata = inputBox.value;
//     let getLocalStroage = localStorage.getItem("New Todo");
//     if(getLocalStroage == null){
//         listArr=[]
//     }else{
//         listArr=JSON.parse(getLocalStroage)
//     }
//     listArr.push(userdata);
//     localStorage.setItem("New Todo",JSON.stringify(listArr));
// }