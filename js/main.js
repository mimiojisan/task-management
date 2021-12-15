Vue.config.devtools = true;

var app = new Vue({
  el: "#app",
  data() {
    return {
      taskList: [],
      columns: [
        {
          label: "Task",
          field: "task",
        },
        {
          label: "Group",
          field: "group",
        },
        {
          label: "Date",
          field: "date",
          type: "date",
          dateInputFormat: "YYYY-MM-DD",
          dateOutputFormat: "YYYY-MM-DD",
        },
      ],
      rows: [],
      rowSelection: [],
      doneTaskFlg: "",
      DatePickerFormat: "yyyy-MM-dd",
      ja: vdp_translation_ja.js,
    };
  },
  components: {
    "vuejs-datepicker": vuejsDatepicker,
  },
  // タスクの保存
  watch: {
    taskList: {
      handler() {
        const vm = this;
        vm.saveCurrent();
      },
      deep: true,
    },
    rows: {
      handler() {
        const vm = this;
        vm.saveCurrent();
      },
      deep: true,
    },
  },
  mounted() {
    const vm = this;
    // ローカルストレージからデータを読み込む
    let savedTasks = localStorage.getItem("taskList");
    // データがあれば代入、なければからタスクの読み込み
    if (savedTasks) {
      savedTasks = JSON.parse(savedTasks);
    } 
    vm.$set(vm, "taskList", savedTasks);

    let savedRecord = localStorage.getItem("rows");
    // データがあれば代入、なければからレコードの読み込み
    if (savedRecord) {
      savedRecord = JSON.parse(savedRecord);
    } 
    vm.$set(vm, "rows", savedRecord);
  },
  methods: {
    // ホバー時のアクション（追加）
    addClass($event) {
      $event.target.classList.add("hover");
    },
    // ホバー時のアクション（削除）
    removeClass($event) {
      $event.target.classList.remove("hover");
    },
    // ローカルストレージに保存
    saveCurrent() {
      const vm = this;
      console.log(vm.taskList);
      const tasks = JSON.stringify(vm.taskList);
      localStorage.setItem("taskList", tasks);
      console.log(vm.rows);
      const records = JSON.stringify(vm.rows);
      localStorage.setItem("rows", records);
    },
    // タスクの追加
    addTask(taskList, index, item) {
      if(taskList[index].name && taskList[index].time){
        // テーブル（rows）にタスクを移す
        item.task.push({
          name: "",
          time: "",
        });
      } else {
        // タスクの内容が空白の場合
        if(!taskList[index].name){
          alert("タスクグループが入力されていません");
        }
        // タスクの日付が空白の場合
        if(!taskList[index].time){
          alert("タスクグループの日付が入力されていません");
        }
      }
    },
    // タスクグループの追加
    addGroup() {
      const vm = this;
      vm.taskList.push({
        name: "",
        task: [],
      });
    },
    // タスクの削除
    delTask(item, index) {
      item.splice(index, 1);
    },
    // タスクグループの削除
    delGroup(index) {
      const vm = this;
      vm.taskList.splice(index, 1);
    },
    // 完了タスク一覧（表示・非表示）
    doneTaskList() {
      const vm = this;
      vm.doneTaskFlg = !vm.doneTaskFlg;
    },
    // 完了タスクの追加
    addDone(item, index2) {
      const vm = this;
      // タスクの内容と日付が空白ではない場合
      if (item.task[index2].name && item.task[index2].time) {
        // テーブル（rows）にタスクを移す
        const date = vm.parseTime(item.task[index2].time);
        vm.rows.push({
          task: item.task[index2].name,
          group: item.name,
          date,
        });
        // タスク欄から削除する
        item.task.splice(index2, 1);
      } else {
        // タスクの内容が空白の場合
        if (!item.task[index2].name) {
          alert("タスクが入力されていません");
        }
        // タスクの日付が空白の場合
        if (!item.task[index2].time) {
          alert("タスクの日付が入力されていません");
        }
      }
    },
    // レコード削除処理
    delRecord(rows, rowSelection) {
      const vm = this;
      // 選択したレコードを削除する
      for (item in rowSelection) {
        rows.splice(rowSelection[item].originalIndex, 1, "");
      }
      // 配列内の空以外の要素を格納する
      const tmp = rows.filter(Boolean);
　　// 配列内の全要素を削除する 　　
      vm.rows.splice(0, vm.rows.length);
      // 要素の中身だけを配列に戻す
      vm.rows.push(...tmp);
    },
    // 削除レコードの選択
    selectionChanged(params) {
      const vm = this;
      // 選択したレコードを別の配列に格納する
      vm.rowSelection = params.selectedRows;
      console.log(vm.rowSelection);
    },
    // 時間の返還
    parseTime(time) {
      let doneDate = new String(time);
      const checkFormat = doneDate.match(/^(\d+)-(\d+)-(\d+).*$/);
      if (checkFormat != null) {
        return doneDate;
      } else {
        doneDate = new Date(doneDate);
      }
      var dt = doneDate;
      var year = dt.getFullYear();
      var month = dt.getMonth() + 1;
      var date = dt.getDate();
      var hours = dt.getHours();
      var minutes = dt.getMinutes();
      var seconds = dt.getSeconds();
      var ymdhms =
        new String(year) +
        "-" +
        ("00" + new String(month)).slice(-2) +
        "-" +
        ("00" + new String(date)).slice(-2);
      ymdhms +=
        " " +
        ("00" + new String(hours)).slice(-2) +
        ":" +
        ("00" + new String(minutes)).slice(-2) +
        ":" +
        ("00" + new String(seconds)).slice(-2);
      return ymdhms;
    }
  },
});

