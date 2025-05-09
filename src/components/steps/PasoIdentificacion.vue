<template>
  <div class="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
    <h2 class="text-2xl font-semibold text-center mb-2">Paso 1: Identificación del Predio</h2>
    <p class="text-center text-sm text-gray-500 mb-6">Por favor completa la información básica del predio</p>

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label>Número Interno *</label>
        <input v-model="form.numeroInterno" type="text" required />
      </div>

      <div>
        <label>Nombre de Propiedad *</label>
        <input v-model="form.nombrePropiedad" type="text" required />
      </div>

      <div>
        <label>Tipo de Predio *</label>
        <select v-model="form.tipo" required>
          <option value="" disabled>Seleccione</option>
          <option>Lote</option>
          <option>Edificio</option>
          <option>Local</option>
          <option>Oficina</option>
        </select>
      </div>

      <div>
        <label>Dirección *</label>
        <input v-model="form.direccion" type="text" required />
      </div>

      <div>
        <label>Ciudad *</label>
        <select v-model="form.ciudad" required>
          <option value="" disabled>Seleccione</option>
          <option>Bogotá</option>
          <option>Medellín</option>
          <option>Cali</option>
          <option>Barranquilla</option>
          <option>Cartagena</option>
          <option>Santa Marta</option>
          <option>Manizales</option>
          <option>Pereira</option>
          <option>Armenia</option>
          <option>Villavicencio</option>
          <option>Ibagué</option>
          <option>Bucaramanga</option>
          <option>Cúcuta</option>
          <option>Popayán</option>
          <option>Pasto</option>
          <option>Neiva</option>
        </select>
      </div>

      <div>
        <label>Número Matrícula Inmobiliaria</label>
        <input v-model="form.matriculaInmobiliaria" type="text" />
        <input
          v-if="!form.documentoMatriculaInmobiliariaUrl"
          type="file"
          accept="application/pdf"
          @change="handleArchivoMatricula"
          class="mt-2"
        />

        <!-- Bloque visual para documento cargado -->
        <div v-if="form.documentoMatriculaInmobiliariaUrl" class="mt-4 bg-gray-100 p-3 rounded shadow text-sm text-black">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 1.5a1 1 0 0 1 1 0l6 3A1 1 0 0 1 17 5v10a1 1 0 0 1-.553.894l-6 3a1 1 0 0 1-.894 0l-6-3A1 1 0 0 1 3 15V5a1 1 0 0 1 .553-.894l6-3zM10 11H9v4H8v-4H7v-1h3v1z" />
              </svg>
              <a
                :href="form.documentoMatriculaInmobiliariaUrl"
                target="_blank"
                class="text-black font-medium underline hover:text-gray-700"
              >
                Ver Matrícula Inmobiliaria (PDF)
              </a>
            </div>
            <div class="flex items-center gap-4">
              <button class="text-sm text-gray-600 hover:text-black font-semibold underline" @click="triggerInputArchivoMatricula">
                Reemplazar documento
              </button>
              <button class="text-sm text-red-600 hover:text-red-800 font-semibold underline" @click="eliminarArchivoMatricula">
                Eliminar documento
              </button>
            </div>
          </div>
          <div class="ml-7 mt-1 text-gray-500 text-xs">
            {{ nombreArchivoMatricula }}
          </div>
          <input
            ref="inputArchivoMatricula"
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handleArchivoMatricula"
          />
        </div>
      </div>

      <div>
        <label>CHIP</label>
        <input v-model="form.chip" type="text" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'

export default {
  name: 'PasoIdentificacion',
  props: {
    modelValue: Object
  },
  computed: {
    form: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    nombreArchivoMatricula() {
      const url = this.form.documentoMatriculaInmobiliariaUrl
      if (!url) return ''
      try {
        const decoded = decodeURIComponent(url)
        return decoded.substring(decoded.lastIndexOf('/') + 1).split('?')[0]
      } catch (e) {
        return 'Documento cargado'
      }
    }
  },
  methods: {
    triggerInputArchivoMatricula() {
      this.$refs.inputArchivoMatricula.click()
    },
    eliminarArchivoMatricula() {
      if (!this.form.documentoMatriculaInmobiliariaUrl) return
      const confirmar = confirm('¿Estás seguro de que deseas eliminar el documento cargado?')
      if (!confirmar) return
      this.$emit('archivoEliminado', this.form.documentoMatriculaInmobiliariaUrl)
      this.form.documentoMatriculaInmobiliariaUrl = ''
      this.$refs.inputArchivoMatricula.value = null
    },
    async handleArchivoMatricula(event) {
      const archivo = event.target.files[0]
      if (!archivo) return

      if (this.form.documentoMatriculaInmobiliariaUrl) {
        this.$emit('archivoEliminado', this.form.documentoMatriculaInmobiliariaUrl)
      }

      const ruta = `documentos/matriculas/${Date.now()}_${archivo.name}`
      const ref = storageRef(storage, ruta)

      try {
        await uploadBytes(ref, archivo)
        const url = await getDownloadURL(ref)
        this.form.documentoMatriculaInmobiliariaUrl = url
        this.$emit('archivoTemporal', url)
        console.log('✅ Archivo subido con éxito:', url)
      } catch (error) {
        console.error('❌ Error al subir el archivo:', error)
        alert('Error al subir el archivo. Revisa la consola.')
      }
    }
  }
}
</script>

<style scoped>
label {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}
input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
</style>