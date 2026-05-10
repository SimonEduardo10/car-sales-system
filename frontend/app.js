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

            // 🔐 LOGIN
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
            fetch("http://localhost:8000/api/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    this.logado = true;
                    alert("✔ Login feito com sucesso");
                    this.carregarCarros(); // atualiza dashboard após login
                } else {
                    alert("❌ Login inválido");
                }
            })
            .catch(err => console.error("Erro no login:", err));
        },

        logout() {
            this.logado = false;
            this.username = "";
            this.password = "";
        },

        // ======================
        // LISTAR
        // ======================
        carregarCarros() {
            fetch("http://localhost:8000/api/carros.php")
                .then(res => res.json())
                .then(data => {
                    this.carros = data;
                    this.totalCarros = data.length;
                })
                .catch(err => console.error("Erro ao carregar carros:", err));
        },

        // ======================
        // SALVAR (CREATE + UPDATE)
        // ======================
        salvarCarro() {

            if (!this.logado) {
                alert("❌ Precisas fazer login primeiro");
                return;
            }

            let url = "http://localhost:8000/api/carros.php";

            if (this.carro.id) {
                url += "?action=update";
            }

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.carro)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                this.limparFormulario();
                this.carregarCarros();
            })
            .catch(err => console.error("Erro ao salvar:", err));
        },

        // ======================
        // ELIMINAR
        // ======================
        eliminarCarro(id) {

            if (!this.logado) {
                alert("❌ Precisas fazer login primeiro");
                return;
            }

            fetch("http://localhost:8000/api/carros.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            .then(res => res.json())
            .then(() => this.carregarCarros())
            .catch(err => console.error("Erro ao eliminar:", err));
        },

        // ======================
        // EDITAR
        // ======================
        editarCarro(carro) {
            this.carro = { ...carro };
        },

        // ======================
        // LIMPAR FORM
        // ======================
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