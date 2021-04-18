var isFundIn = true;
var inout = document.getElementById('inout');
function toggleInOut(){
  if(isFundIn){
    setFundOut();
  }else{
    setFundIn();
  }
}
function setFundIn(){
  inout.style.background = '#4eaa4d';
  inout.innerText = '+';
  isFundIn = true;
}
function setFundOut(){
  inout.style.background = '#c00';
  inout.innerText = '-';
  isFundIn = false;
}
