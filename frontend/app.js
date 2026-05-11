const { createApp } = Vue;

createApp({
    data() {
        return {
            carros: [],
            totalCarros: 0,

            carro: {
                id: null,
                marca: "",
                modelo: "",
                ano: "",
                preco: "",
                imagem: ""
            },

            username: "",
            password: "",
            logado: false
        }
    },

    mounted() {
        this.carregarCarros();
    },

    methods: {

        // ======================
        // LOGIN
        // ======================
        login() {
            fetch("/api/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            })
            .then(async res => {
                const data = await res.json().catch(() => null);
                console.log("LOGIN RESPONSE:", data, res.status);

                return data;
            })
            .then(data => {

                if (data && data.user) {
                    this.logado = true;
                    alert("✔ Login feito com sucesso");
                    this.carregarCarros();
                } else {
                    alert("❌ Login inválido");
                }

            })
            .catch(err => {
                console.error("Erro no login:", err);
                alert("Erro no servidor login");
            });
        },

        // LOGOUT
        logout() {
            this.logado = false;
            this.username = "";
            this.password = "";
        },

        // LISTAR
        carregarCarros() {
            fetch("/api/carros.php")
            .then(res => res.json())
            .then(data => {
                this.carros = data;
                this.totalCarros = data.length;
            })
            .catch(err => console.error("Erro carros:", err));
        },

        // SALVAR
        salvarCarro() {

            if (!this.logado) {
                alert("❌ Faz login primeiro");
                return;
            }

            let url = "/api/carros.php";

            if (this.carro.id) {
                url += "?action=update";
            }

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.carro)
            })
            .then(res => res.json())
            .then(() => {
                this.limparFormulario();
                this.carregarCarros();
            })
            .catch(err => console.error(err));
        },

        // ELIMINAR
        eliminarCarro(id) {

            if (!this.logado) return;

            fetch("/api/carros.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })
            .then(res => res.json())
            .then(() => this.carregarCarros())
            .catch(err => console.error(err));
        },

        editarCarro(carro) {
            this.carro = { ...carro };
        },

        limparFormulario() {
            this.carro = {
                id: null,
                marca: "",
                modelo: "",
                ano: "",
                preco: "",
                imagem: ""
            };
        }

    }

}).mount("#app");