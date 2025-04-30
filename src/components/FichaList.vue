<template>
  <div class="ficha-lista">
    <h2>Listado de Fichas Registradas</h2>

    <input
      type="text"
      v-model="terminoBusqueda"
      placeholder="🔍 Buscar por nombre, matrícula, dirección, ciudad, etc..."
      class="buscador"
    />

    <div v-if="loading">Cargando fichas...</div>
    <div v-else-if="fichasFiltradas.length === 0">No se encontraron fichas.</div>

    <div v-else class="tarjetas">
      <div class="tarjeta" v-for="(ficha, index) in fichasFiltradas" :key="index">
        <h3>{{ ficha.nombrePropiedad }} <span>({{ ficha.numeroInterno }})</span></h3>
        <p><strong>Ubicación:</strong> {{ ficha.direccion }}</p>
        <p><strong>Ciudad:</strong> {{ ficha.ciudad }}</p>
        <p><strong>Área Arrendada:</strong> {{ ficha.areaArrendada || '—' }}</p>

        <div class="botones-accion">
          <button class="boton-ver" @click="verDetalle(ficha.id)">🔍 Ver detalle</button>
          <button class="boton-editar" @click="editarFicha(ficha.id)">✏️ Editar</button>
          <button class="boton-eliminar" @click="eliminarFicha(ficha.id, ficha.nombrePropiedad)">🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default {
  name: "FichaList",
  data() {
    return {
      fichas: [],
      loading: true,
      terminoBusqueda: ""
    };
  },
  computed: {
    fichasFiltradas() {
      const texto = this.terminoBusqueda.toLowerCase().trim();
      return this.fichas.filter(ficha =>
        ficha.nombrePropiedad?.toLowerCase().includes(texto) ||
        ficha.numeroInterno?.toLowerCase().includes(texto) ||
        ficha.direccion?.toLowerCase().includes(texto) ||
        ficha.ciudad?.toLowerCase().includes(texto) ||
        ficha.matriculaInmobiliaria?.toLowerCase().includes(texto) ||
        ficha.chip?.toLowerCase().includes(texto) ||
        (ficha.nombresAntiguos || []).some(nombreObj =>
          nombreObj.nombre?.toLowerCase().includes(texto)
        )
      );
    }
  },
  methods: {
    async cargarFichas() {
      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, "predios"));
        this.fichas = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error al cargar fichas:", error);
      } finally {
        this.loading = false;
      }
    },
    verDetalle(id) {
      this.$router.push(`/ficha/${id}`);
    },
    editarFicha(id) {
      this.$router.push(`/ficha/editar/${id}`);
    },
    async eliminarFicha(id, nombre) {
      if (confirm(`¿Estás seguro de eliminar la ficha de "${nombre}"?`)) {
        try {
          await deleteDoc(doc(db, 'predios', id))
          this.cargarFichas()
        } catch (error) {
          console.error('Error al eliminar ficha:', error)
        }
      }
    }
  },
  mounted() {
    this.cargarFichas();
  }
};
</script>

<style scoped>
.ficha-lista {
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Georgia', serif;
}

.buscador {
  width: 100%;
  padding: 12px;
  margin-bottom: 30px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.tarjetas {
  display: grid;
  gap: 20px;
}

.tarjeta {
  border: 2px solid black;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
}

.tarjeta h3 {
  font-size: 1.2em;
}

.tarjeta span {
  font-size: 0.9em;
  color: gray;
}

.botones-accion {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

button {
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  font-family: 'Georgia', serif;
  cursor: pointer;
}

.boton-editar {
  background-color: #444;
  color: white;
}

.boton-eliminar {
  background-color: crimson;
  color: white;
}

.boton-ver {
  background-color: darkblue;
  color: white;
}
</style>
