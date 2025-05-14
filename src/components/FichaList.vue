<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h2 class="text-2xl font-bold text-center mb-8">Listado de Fichas Registradas</h2>

    <input
      type="text"
      v-model="terminoBusqueda"
      placeholder="Buscar por nombre, matrícula, dirección, ciudad, etc..."
      class="w-full p-3 mb-8 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
    />

    <div v-if="loading" class="text-center text-gray-500">Cargando fichas...</div>
    <div v-else-if="fichasFiltradas.length === 0" class="text-center text-gray-600">No se encontraron fichas.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        class="border border-gray-300 rounded-lg p-5 bg-white shadow hover:shadow-md transition duration-200"
        v-for="(ficha, index) in fichasFiltradas"
        :key="index"
      >
        <h3 class="text-lg font-semibold mb-1">{{ ficha.nombrePropiedad }} <span class="text-gray-500 text-sm">({{ ficha.numeroInterno }})</span></h3>
        <p class="text-sm text-gray-700"><strong>Ubicación:</strong> {{ ficha.direccion }}</p>
        <p class="text-sm text-gray-700"><strong>Ciudad:</strong> {{ ficha.ciudad }}</p>

        <div class="flex flex-wrap gap-2 mt-4">
          <button
            class="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700 text-sm"
            @click="verDetalle(ficha.id)"
          >
            Ver
          </button>
          <button
            class="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 text-sm"
            @click="editarFicha(ficha.id)"
          >
            Editar
          </button>
          <button
            class="flex-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-500 text-sm"
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

import { db } from '../firebase/config'
import { doc, getDoc, deleteDoc, getDocs, collection } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config'

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
      if (!confirm(`¿Estás seguro de eliminar la ficha de "${nombre}"?`)) return

      try {
        const fichaRef = doc(db, 'predios', id)
        const fichaSnap = await getDoc(fichaRef)

        if (fichaSnap.exists()) {
          const fichaData = fichaSnap.data()

          const baseUrl = "https://firebasestorage.googleapis.com/v0/b/"
          const bucket = storage.app.options.storageBucket
          const pathStart = `${baseUrl}${bucket}/o/`

          const eliminarArchivo = async (url) => {
            if (!url) return
            try {
              const encodedPath = url.replace(pathStart, '').split('?')[0]
              const decodedPath = decodeURIComponent(encodedPath)
              const ref = storageRef(storage, decodedPath)
              await deleteObject(ref)
            } catch (e) {
              console.warn('No se pudo eliminar archivo:', url, e)
            }
          }

          await eliminarArchivo(fichaData.documentoMatriculaInmobiliariaUrl)
          await eliminarArchivo(fichaData.documentoClaseInventarioUrl)
          await eliminarArchivo(fichaData.documentoEstadoTecnicoUrl)

          if (Array.isArray(fichaData.imagenes)) {
            for (const img of fichaData.imagenes) {
              if (typeof img === 'string') {
                await eliminarArchivo(img)
              }
            }
          }
        }

        await deleteDoc(fichaRef)
        await this.cargarFichas()

        alert('✅ Ficha y archivos eliminados correctamente.')
      } catch (error) {
        console.error('Error al eliminar ficha:', error)
        alert('❌ Ocurrió un error al eliminar la ficha. Revisa la consola.')
      }
    }

  },
  mounted() {
    this.cargarFichas();
  }
};
</script>

<style scoped>
/* No se necesita estilos adicionales, todo lo maneja Tailwind */
</style>
