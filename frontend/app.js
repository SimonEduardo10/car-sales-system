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
        // 🔥 IMAGEM AUTOMÁTICA
        // ======================
        getImagem(marca) {
            if (!marca) {
                return "https://via.placeholder.com/400x200?text=Carro";
            }

            return `https://source.unsplash.com/400x200/?${marca},car,vehicle`;
        },

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

        // ======================
        // LOGOUT
        // ======================
        logout() {
            this.logado = false;
            this.username = "";
            this.password = "";
        },

        // ======================
        // LISTAR CARROS
        // ======================
        carregarCarros() {

            fetch("/api/carros.php")
            .then(res => res.json())
            .then(data => {

                this.carros = data;
                this.totalCarros = data.length;

            })
            .catch(err => console.error("Erro carros:", err));
        },

        // ======================
        // SALVAR CARRO
        // ======================
        salvarCarro() {

            if (!this.logado) {
                alert("❌ Faz login primeiro");
                return;
            }

            // 🔥 AUTO IMAGEM SE NÃO TIVER
            if (!this.carro.imagem) {
                this.carro.imagem = this.getImagem(this.carro.marca);
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
            .catch(err => console.error("Erro salvar:", err));
        },

        // ======================
        // ELIMINAR CARRO
        // ======================
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
            .catch(err => console.error("Erro eliminar:", err));
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