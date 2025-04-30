<template>
  <div class="bg-white p-6 rounded shadow max-w-6xl mx-auto my-6">
    <h2 class="text-2xl font-semibold text-center mb-6">Registrar nueva ficha</h2>

     <!-- IDENTIFICACIÓN -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Identificación</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.numero_interno" label="N. interno" />
        <InputField v-model="ficha.nombre_propiedad" label="Nombre de Propiedad" />
        <InputField v-model="ficha.tipo" label="Tipo" />
        <InputField v-model="ficha.direccion" label="Dirección" />
        <InputField v-model="ficha.ciudad" label="Ciudad" />
        <InputField v-model="ficha.matricula" label="N. Matrícula Inmobiliaria" />
        <InputField v-model="ficha.chip" label="Chip" />
        <InputField v-model="ficha.propietarios" label="Nombre de Propietarios" placeholder="Separados por coma" />
        <InputField v-model="ficha.porcentaje_propietarios" label="% de cada propietario" placeholder="Separados por coma" />
      </div>
    </section>

    <!-- ESTADO ADMINISTRATIVO -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Estado Administrativo</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.estado" label="Estado" />
        <InputField v-model="ficha.arrendatarios" label="Nombre de Arrendatarios" />
        <InputField v-model="ficha.canon" label="Canon de Arrendamiento" />
        <InputField v-model="ficha.area_arrendada" label="Área arrendada según contrato" />
      </div>
    </section>

    <!-- AVÁLUO -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Avalúo</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.avaluo_catastral_actual" label="Avaluo Catastral Año Actual" />
        <InputField v-model="ficha.avaluo_catastral_anterior" label="Avaluo Catastral Año Anterior" />
        <InputField v-model="ficha.avaluo_comercial" label="Avaluo Comercial (último)" />
        <InputField v-model="ficha.fecha_avaluo" label="Fecha del Avalúo Comercial" type="date" />
      </div>
    </section>

    <!-- IMPUESTOS -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Impuestos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.valor_valorizacion" label="¿Está al día en valorización?" />
        <InputField v-model="ficha.valor_predial" label="Valor del impuesto predial al corte" />
        <InputField v-model="ficha.observaciones_impuestos" label="Observaciones sobre estado de deuda" />
      </div>
    </section>

    <!-- SERVICIOS PÚBLICOS -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Servicios Públicos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.energia_direccion" label="Energía - Dirección factura" />
        <InputField v-model="ficha.energia_cuenta" label="Energía - N. cuenta" />
        <InputField v-model="ficha.energia_medidor" label="Energía - N. medidor" />

        <InputField v-model="ficha.agua_direccion" label="Agua - Dirección factura" />
        <InputField v-model="ficha.agua_cuenta" label="Agua - N. cuenta" />
        <InputField v-model="ficha.agua_medidor" label="Agua - N. medidor" />

        <InputField v-model="ficha.gas_direccion" label="Gas - Dirección factura" />
        <InputField v-model="ficha.gas_cuenta" label="Gas - N. cuenta" />
        <InputField v-model="ficha.gas_medidor" label="Gas - N. medidor" />

        <InputField v-model="ficha.observaciones_servicios" label="Observaciones sobre servicios públicos" />
      </div>
    </section>

    <!-- INVENTARIOS -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Inventarios</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.tipo_inventario" label="Clase de inventario" />
        <InputField v-model="ficha.fecha_inventario" label="Fecha del último inventario" type="date" />
      </div>
    </section>

    <!-- ESTADO JURÍDICO Y TÉCNICO -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Estado Jurídico</h3>
      <InputField v-model="ficha.estado_juridico" label="Descripción del proceso jurídico" />

      <h3 class="text-lg font-bold mt-6 mb-2 border-b border-gray-300 pb-1">Estado Técnico</h3>
      <InputField v-model="ficha.estado_tecnico" label="Descripción de estado técnico o licencias" />
    </section>

    <!-- COORDENADAS -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Ubicación</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField v-model="ficha.latitud" label="Latitud" />
        <InputField v-model="ficha.longitud" label="Longitud" />
      </div>
    </section>

    <!-- HISTORIAL DE NOMBRES -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Historial de Nombres</h3>
      <div
        v-for="(nombre, index) in ficha.historial_nombres"
        :key="index"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-2"
      >
        <InputField v-model="nombre.nombre" label="Nombre anterior" />
        <InputField v-model="nombre.año_desde" label="Desde" type="number" />
        <InputField v-model="nombre.año_hasta" label="Hasta" type="number" />
        <button
          type="button"
          class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-1"
          @click="eliminarNombre(index)"
        >
          Eliminar
        </button>
      </div>
      <button
        type="button"
        class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        @click="agregarNombre"
      >
        Agregar nombre
      </button>
    </section>

    <!-- CARGA DE IMÁGENES -->
    <section class="mb-6">
      <h3 class="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Imágenes del predio</h3>
      <input type="file" @change="procesarImagenes" multiple class="mb-4" />
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <img
          v-for="(img, index) in ficha.imagenes"
          :key="index"
          :src="img"
          alt="Vista previa"
          class="w-full h-32 object-cover border rounded"
        />
      </div>
    </section>

    <!-- BOTONES -->
    <div class="flex justify-end gap-4 mt-6">
      <button @click="guardarFicha" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Guardar</button>
      <button @click="cancelarEdicion" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Cancelar edición</button>
    </div>
  </div>
</template>

<script>
import InputField from './partials/InputField.vue'

export default {
  components: { InputField },
  data() {
    return {
      ficha: {
        numero_interno: '',
        nombre_propiedad: '',
        tipo: '',
        direccion: '',
        ciudad: '',
        matricula: '',
        chip: '',
        propietarios: '',
        porcentaje_propietarios: '',
        estado: '',
        arrendatarios: '',
        canon: '',
        area_arrendada: '',
        avaluo_catastral_actual: '',
        avaluo_catastral_anterior: '',
        avaluo_comercial: '',
        fecha_avaluo: '',
        valor_valorizacion: '',
        valor_predial: '',
        observaciones_impuestos: '',
        energia_direccion: '',
        energia_cuenta: '',
        energia_medidor: '',
        agua_direccion: '',
        agua_cuenta: '',
        agua_medidor: '',
        gas_direccion: '',
        gas_cuenta: '',
        gas_medidor: '',
        observaciones_servicios: '',
        tipo_inventario: '',
        fecha_inventario: '',
        estado_juridico: '',
        estado_tecnico: '',
        latitud: '',
        longitud: '',
        historial_nombres: [],
        imagenes: []
      }
    }
  },
  methods: {
    agregarNombre() {
      this.ficha.historial_nombres.push({ nombre: '', año_desde: '', año_hasta: '' })
    },
    eliminarNombre(index) {
      this.ficha.historial_nombres.splice(index, 1)
    },
    procesarImagenes(event) {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.ficha.imagenes.push(e.target.result)
        }
        reader.readAsDataURL(files[i])
      }
    },
    guardarFicha() {
      console.log('Ficha guardada:', this.ficha)
      // lógica Firebase o almacenamiento local
    },
    cancelarEdicion() {
      // resetear ficha
      Object.keys(this.ficha).forEach((k) => {
        if (Array.isArray(this.ficha[k])) this.ficha[k] = []
        else this.ficha[k] = ''
      })
    }
  }
}
</script>
