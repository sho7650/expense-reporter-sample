const baseUrl = "";

const getPayments = function (callback) {
  axios
    .get(`${baseUrl}/api/payment`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        callback(null, response.data);
      } else {
        callback(true, response);
      }
    })
    .catch((response) => {
      callback(true, response);
    });
};

const Payment = {
  template: "#payment",
  data: function () {
    return {
      loading: false,
      error: false,
      payments: function () {
        return [];
      },
    };
  },
  created: function () {
    this.fetchData();
  },
  watch: {
    $route: "fetchData",
  },
  methods: {
    fetchData: function () {
      this.loading = true;
      getPayments(
        function (err, payments) {
          this.loading = false;
          if (!err) this.payments = payments;
        }.bind(this)
      );
    },
  },
};

const Expense = {
  template: "#expense",
  data: function () {
    let decoded = {};
    if (localStorage.token) {
      decoded = jwt_decode(localStorage.token);
    }
    return {
      user: decoded.email || "",
      id: decoded.id || "",
      user_name: decoded.user_name || "",
      date: "",
      type: "",
      amount: 0,
      description: "",
      error: false,
    };
  },
  methods: {
    expense: function () {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.token;
      axios
        .post(`${baseUrl}/api/expense`, {
          user: this.user,
          user_id: this.id,
          user_name: this.user_name,
          date: this.date,
          type: this.type,
          amount: this.amount,
          description: this.description,
        })
        .then((response) => {
          if (response.status === 200) {
            this.error = false;
            console.log(response);
            this.date = "";
            this.type = "";
            this.amount = 0;
            this.description = "";
          }
        })
        .catch((response) => {
          this.error = true;
          console.log(response);
        });
    },
  },
};

const Login = {
  template: "#login",
  data: function () {
    return {
      user: localStorage.user || "",
      password: localStorage.password || "",
      remember: localStorage.remember || false,
      error: false,
    };
  },
  methods: {
    login: function () {
      axios
        .post(`${baseUrl}/api/auth`, {
          user: this.user,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 200) {
            this.error = false;
            localStorage.token = response.data.token;
            if (this.remember) {
              localStorage.user = this.user;
              localStorage.password = this.password;
              localStorage.remember = true;
            } else {
              delete localStorage.user;
              delete localStorage.password;
              delete localStorage.remember;
            }
            this.$router.replace("/expense");
          } else {
            this.error = true;
          }
        })
        .catch((response) => {
          this.error = true;
          this.remember = false;
          console.log(response);
        });
    },
  },
};

const router = new VueRouter({
  routes: [
    {
      path: "/payment",
      component: Payment,
      beforeEnter: (to, from, next) => {
        // 認証前の場合は /login ページへ遷移する
        if (!localStorage.token) {
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
        } else {
          next();
        }
      },
    },
    {
      path: "/expense",
      component: Expense,
      beforeEnter: (to, from, next) => {
        // 認証前の場合は /login ページへ遷移する
        if (!localStorage.token) {
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
        } else {
          next();
        }
      },
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/logout",
      beforeEnter: (to, from, next) => {
        delete localStorage.token;
        next("/login");
      },
    },
    {
      path: "*",
      redirect: "/expense",
    },
  ],
});

const app = new Vue({
  router,
}).$mount("#app");