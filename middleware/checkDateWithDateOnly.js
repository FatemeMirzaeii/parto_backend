function checkDateWithDateOnly(date){
  let ts = Date.now();
  let date_ob = new Date(ts);
  let nowDay = date_ob.getDate();
  let nowMonth = date_ob.getMonth() + 1;
  let nowYear = date_ob.getFullYear();
  let reqDate= date.split("-");
  
  if(nowYear<reqDate[0]){
    return false;
  }
  else if(nowYear==reqDate[0] && nowMonth<reqDate[1]){
      return false;
  }
  else if(nowYear==reqDate[0] && nowMonth==reqDate[1]&&nowDay<reqDate[2]){
      return false
  }
  return true;

}
module.exports=checkDateWithDateOnly;