<template>
  <div class="max-w-6xl mx-auto px-4 py-10 h-[calc(100vh-100px)] overflow-y-auto">
    <h2 class="text-2xl font-bold text-center mb-6">Listado de Fichas Registradas</h2>

    <input
      type="text"
      v-model="terminoBusqueda"
      placeholder="Buscar por nombre, matrícula, dirección, ciudad, etc..."
      class="w-full p-3 mb-8 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
    />

    <div v-if="loading" class="text-center text-gray-500">Cargando fichas...</div>
    <div v-else-if="fichasFiltradas.length === 0" class="text-center text-gray-600">No se encontraron fichas.</div>

    <div v-else class="grid gap-6">
      <div
        class="border border-black rounded-lg p-6 bg-white shadow-sm"
        v-for="(ficha, index) in fichasFiltradas"
        :key="index"
      >
        <h3 class="text-lg font-semibold mb-1">{{ ficha.nombrePropiedad }} <span class="text-gray-500 text-sm">({{ ficha.numeroInterno }})</span></h3>
        <p><strong>Ubicación:</strong> {{ ficha.direccion }}</p>
        <p><strong>Ciudad:</strong> {{ ficha.ciudad }}</p>
        <p><strong>Área Arrendada:</strong> {{ ficha.areaArrendada || '—' }}</p>

        <div class="flex gap-2 mt-4">
          <button
            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
            @click="verDetalle(ficha.id)"
          >
            Ver detalle
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
            @click="editarFicha(ficha.id)"
          >
            Editar
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
            @click="eliminarFicha(ficha.id, ficha.nombrePropiedad)"
          >
            Eliminar
          </button>
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
/* Ya no necesitamos estilos personalizados si usamos Tailwind */
</style>
