/* ============================================================
   海大教务课表导出书签 · v1（2026-10-24）
   ─────────────────────────────────────────────────────────────
   在金智 EAMS「我的课表」页面运行，把课表转成 JSON：
   自动复制到剪贴板 + 下载 .json 文件，去「海大课程表.html」⇅ 粘贴导入。
   解析思路借鉴 wtlyu/Course-Table-ICS-Formatter（Apache-2.0）
   https://github.com/wtlyu/Course-Table-ICS-Formatter

   【用法A · 电脑 Edge/Chrome 控制台】
     1. 登录 https://jwxt.shmtu.edu.cn → 信息查询 → 我的课表（页面显示出课表格子）
     2. 按 F12 → Console（控制台）
     3. 粘贴下面【完整版】整段代码，回车 → 弹出"已导出 N 门课程"
     4. 打开 课程表.html → 右上角 ⇅ → 粘贴 → 导入

   【用法B · 书签（推荐，电脑存一次手机同步用）】
     1. 电脑 Edge/Chrome：收藏一个任意网页，然后编辑该收藏
     2. 名称改「导出海大课表」，网址整行替换成下面【书签版】（javascript: 开头那行）
     3. 电脑登录 Edge 账号开收藏同步 → 手机 Edge 收藏夹里就有它
     4. 手机：登录教务 → 打开我的课表 → 收藏夹里点「导出海大课表」
   ============================================================ */

/* ══════════ 完整版（控制台粘贴用）══════════ */

(function () {
  if (!window.table0 || !window.table0.activities) {
    alert('没找到课表数据：请先打开教务系统「信息查询 → 我的课表」，等课表显示出来再运行');
    return;
  }
  var SEC = 13; // EAMS 每天节数（海大为 13）
  var acts = window.table0.activities;
  var items = {};
  Object.keys(acts).forEach(function (k) {
    var idx = +k;
    var day = Math.floor(idx / SEC) + 1;   // 格子序号 → 星期
    var sec = idx % SEC + 1;               // 格子序号 → 节次
    acts[k].forEach(function (a) {
      var w = a.vaildWeeks || '';
      var weeks = [];
      for (var i = 1; i < w.length; i++) if (w.charAt(i) === '1') weeks.push(i);
      if (!weeks.length) return;
      // 去掉课程名末尾的课号，如 计算机伦理学(XX111120_003) → 计算机伦理学
      var name = (a.courseName || '未命名').replace(/\s*[（(][^()（）]*_[^()（）]*[)）]\s*$/, '');
      var key = name + '|' + (a.teacherName || '') + '|' + (a.roomName || '') + '|' + w + '|' + day;
      var it = items[key];
      if (!it) {
        it = items[key] = { name: name, teacher: a.teacherName || '', room: a.roomName || '',
                            weeks: weeks, dayOfWeek: day, startSection: sec, endSection: sec };
      } else {
        if (sec < it.startSection) it.startSection = sec;
        if (sec > it.endSection) it.endSection = sec;
      }
    });
  });
  var courses = Object.keys(items).map(function (k) { return items[k]; });
  courses.sort(function (a, b) { return a.dayOfWeek - b.dayOfWeek || a.startSection - b.startSection; });

  var semEl = document.querySelector('#courseTableForm input.calendar-text');
  var sem = (semEl && semEl.value) || '我的课表';
  var data = {
    meta: { semesterName: sem, firstMonday: null, demo: false },
    timeTable: [
      {s:'08:00',e:'08:45'},{s:'08:55',e:'09:40'},{s:'10:00',e:'10:45'},{s:'10:55',e:'11:40'},
      {s:'11:50',e:'12:35'},{s:'13:30',e:'14:15'},{s:'14:25',e:'15:10'},{s:'15:20',e:'16:05'},
      {s:'16:15',e:'17:00'},{s:'17:10',e:'17:55'},{s:'18:30',e:'19:15'},{s:'19:25',e:'20:10'},{s:'20:20',e:'21:05'}
    ],
    courses: courses
  };
  var txt = JSON.stringify(data);

  try { // 下载备份文件
    var blob = new Blob([txt], { type: 'application/json' });
    var el = document.createElement('a');
    el.href = URL.createObjectURL(blob);
    el.download = '海大课程表-' + sem + '.json';
    document.body.appendChild(el); el.click(); el.remove();
  } catch (e) {}

  try { // 复制到剪贴板
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  } catch (e) {}

  alert('已导出 ' + courses.length + ' 门课程（' + sem + '）\nJSON 已复制到剪贴板，同时下载了备份文件\n→ 打开「海大课程表.html」右上角 ⇅ 粘贴导入');
})();

/* ══════════ 书签版（压缩成一行，存进收藏夹网址栏用）══════════ */

javascript:(function(){var t=window.table0;if(!t||!t.activities){alert('没找到课表数据：请先打开教务「信息查询→我的课表」再点我');return}var A=t.activities,I={},k;for(k in A){var idx=+k,d=Math.floor(idx/13)+1,s=idx%13+1;A[k].forEach(function(a){var w=a.vaildWeeks||'',W=[],i;for(i=1;i<w.length;i++)if(w.charAt(i)=='1')W.push(i);if(!W.length)return;var n=(a.courseName||'未命名').replace(/\s*[（(][^()（）]*_[^()（）]*[)）]\s*$/,'');var x=n+'|'+(a.teacherName||'')+'|'+(a.roomName||'')+'|'+w+'|'+d;var it=I[x];if(!it)it=I[x]={name:n,teacher:a.teacherName||'',room:a.roomName||'',weeks:W,dayOfWeek:d,startSection:s,endSection:s};else{if(s<it.startSection)it.startSection=s;if(s>it.endSection)it.endSection=s}})}var C=[];for(k in I)C.push(I[k]);C.sort(function(a,b){return a.dayOfWeek-b.dayOfWeek||a.startSection-b.startSection});var el=document.querySelector('#courseTableForm input.calendar-text'),sem=el&&el.value?el.value:'我的课表';var D={meta:{semesterName:sem,firstMonday:null,demo:false},timeTable:[{s:'08:00',e:'08:45'},{s:'08:55',e:'09:40'},{s:'10:00',e:'10:45'},{s:'10:55',e:'11:40'},{s:'11:50',e:'12:35'},{s:'13:30',e:'14:15'},{s:'14:25',e:'15:10'},{s:'15:20',e:'16:05'},{s:'16:15',e:'17:00'},{s:'17:10',e:'17:55'},{s:'18:30',e:'19:15'},{s:'19:25',e:'20:10'},{s:'20:20',e:'21:05'}],courses:C};var txt=JSON.stringify(D);try{var b=new Blob([txt],{type:'application/json'}),a2=document.createElement('a');a2.href=URL.createObjectURL(b);a2.download='海大课程表-'+sem+'.json';document.body.appendChild(a2);a2.click();a2.remove()}catch(e){}try{var ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}catch(e){}alert('已导出'+C.length+'门课程（'+sem+'），JSON已复制\n→ 打开「海大课程表.html」⇅ 粘贴导入')})();
