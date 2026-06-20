function showToast(message){

const toast =
document.createElement("div");

toast.className =
"toast";

toast.innerText =
message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},100);

setTimeout(()=>{

toast.remove();

},3000);

}
setInterval(()=>{

if(
window.location.href.includes(
"orders.html"
)
){

showToast(
"🔔 Có đơn hàng mới!"
);

}

},30000);