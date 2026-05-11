const { createApp } = Vue;

createApp({
    data() {
        return {

            API_BASE: "https://car-sales-system-api.onrender.com",

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
            logado: false,

            loading: false
        }
    },

    mounted() {
        this.carregarCarros();
    },

    methods: {

        // ======================
        // IMAGEM AUTOMÁTICA
        // ======================
        getImagem(marca) {

            if (!marca) {
                return "https://via.placeholder.com/400x200?text=Carro";
            }

            // melhora qualidade e evita imagens quebradas
            return `https://source.unsplash.com/600x400/?${encodeURIComponent(marca)},car,vehicle`;
        },

        // ======================
        // LOGIN
        // ======================
        async login() {

            try {

                this.loading = true;

                const res = await fetch(`${this.API_BASE}/login.php`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });

                const data = await res.json();

                console.log("LOGIN RESPONSE:", data);

                if (data && data.user) {

                    this.logado = true;

                    alert("✔ Login feito com sucesso");

                    this.carregarCarros();

                } else {

                    alert(data.message || "❌ Login inválido");
                }

            } catch (err) {

                console.error("Erro login:", err);
                alert("Erro no servidor login");

            } finally {
                this.loading = false;
            }
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
        async carregarCarros() {

            try {

                const res = await fetch(`${this.API_BASE}/carros.php`);
                const data = await res.json();

                this.carros = data || [];
                this.totalCarros = this.carros.length;

            } catch (err) {

                console.error("Erro carros:", err);
            }
        },

        // ======================
        // SALVAR CARRO
        // ======================
        async salvarCarro() {

            if (!this.logado) {
                alert("❌ Faz login primeiro");
                return;
            }

            try {

                // auto imagem se não existir
                if (!this.carro.imagem) {
                    this.carro.imagem = this.getImagem(this.carro.marca);
                }

                let url = `${this.API_BASE}/carros.php`;

                if (this.carro.id) {
                    url += "?action=update";
                }

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.carro)
                });

                await res.json();

                this.limparFormulario();
                this.carregarCarros();

            } catch (err) {
                console.error("Erro salvar:", err);
                alert("Erro ao salvar carro");
            }
        },

        // ======================
        // ELIMINAR CARRO
        // ======================
        async eliminarCarro(id) {

            if (!this.logado) return;

            try {

                await fetch(`${this.API_BASE}/carros.php`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                });

                this.carregarCarros();

            } catch (err) {
                console.error("Erro eliminar:", err);
            }
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