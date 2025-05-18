document.addEventListener("DOMContentLoaded", function () {
  // Variáveis globais
  let map
  let markers = []
  let allStations = []
  let routeLine = null
  let originMarker = null
  let destinationMarker = null

  // Elementos Gerais
  const menuToggle = document.getElementById("menu-toggle")
  const sidebar = document.getElementById("sidebar")
  const themeToggleBtn = document.getElementById("theme-toggle")
  const themeIcon = document.getElementById("theme-icon")
  const searchForm = document.querySelector(".search-form")

  // Modais
  const carIcon = document.querySelector(".info-card .fa-ellipsis-h")
  const userIcon = document.querySelector(".user-info .fa-user")
  const filterBtn = document.getElementById("filter-btn")

  const carModal = document.getElementById("car-modal")
  const userModal = document.getElementById("user-modal")
  const filterModal = document.getElementById("filter-modal")

  const closeCarModal = document.getElementById("close-car-modal")
  const closeUserModal = document.getElementById("close-user-modal")
  const closeFilterModal = document.getElementById("close-filter-modal")

  const applyFiltersBtn = document.getElementById("apply-filters")

  // Inicializar o mapa
  initMap()
  loadStations()

  setupAutocomplete("origin")
  setupAutocomplete("destination")

  // ====== Event Listeners ======
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    menuToggle.classList.toggle("active")
  })

  window.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("active")
      menuToggle.classList.remove("active")
    }
  })

  themeToggleBtn.addEventListener("click", (e) => {
    e.preventDefault()
    document.body.classList.toggle("dark-mode")

    if (document.body.classList.contains("dark-mode")) {
      themeIcon.classList.remove("fa-toggle-off")
      themeIcon.classList.add("fa-toggle-on")
    } else {
      themeIcon.classList.remove("fa-toggle-on")
      themeIcon.classList.add("fa-toggle-off")
    }
  })

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    calculateRoute()
  })

  carIcon.addEventListener("click", (e) => {
    e.preventDefault()
    openModal(carModal)
  })

  userIcon.addEventListener("click", (e) => {
    e.preventDefault()
    openModal(userModal)
  })

  filterBtn.addEventListener("click", (e) => {
    e.preventDefault()
    openModal(filterModal)
  })
  ;[closeCarModal, closeUserModal, closeFilterModal].forEach((btn) => {
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const modal =
        e.target.closest(".modal") || e.target.parentElement.closest(".modal")
      closeModal(modal)
    })
  })

  applyFiltersBtn.addEventListener("click", (e) => {
    e.preventDefault()
    applyFilters()
    closeModal(filterModal)
  })

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target)
    }
  })

  // Tabs de filtragem
  document.querySelectorAll(".sort-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".sort-tab")
        .forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")
      const tipo = tab.dataset.type
      filterStations(tipo)
    })
  })

  // ====== Funções Auxiliares ======
  function openModal(modal) {
    if (!modal) return
    modal.classList.add("show")
    modal.classList.remove("hide")
    modal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  function closeModal(modal) {
    if (!modal || !modal.classList.contains("show")) return

    modal.classList.add("hide")
    modal.classList.remove("show")

    setTimeout(() => {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }, 300)
  }

  function initMap() {
    const defaultCoords = [-8.117944801423068, -34.91319580429508]

    map = L.map("map").setView(defaultCoords, 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    loadStations()
  }

  function loadStations() {
    // Em vez de chamar a API externa, vamos chamar nossa rota mockada
    fetch("/api/stations")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar estações mockadas")
        return res.json()
      })
      .then((stations) => {
        // Calcula a distância de cada estação em relação ao centro do mapa
        const userCoords = map.getCenter()

        const stationsWithDistance = stations.map((station) => {
          // Calcula a distância em km (aproximação simples)
          const R = 6371 // Raio da Terra em km
          const dLat = ((station.lat - userCoords.lat) * Math.PI) / 180
          const dLng = ((station.lng - userCoords.lng) * Math.PI) / 180
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userCoords.lat * Math.PI) / 180) *
              Math.cos((station.lat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          const distance = R * c

          return {
            ...station,
            distance: parseFloat(distance.toFixed(1)),
          }
        })

        allStations = stationsWithDistance
        filterStations("closest")
      })
      .catch((err) => {
        console.error("Erro ao buscar estações mockadas:", err)
        alert("Não foi possível carregar estações.")

        // Fallback: usa dados estáticos caso a requisição falhe
        const fallbackStations = [
          {
            id: 1,
            name: "RioMar Recife – Estacionamento Coberto",
            lat: -8.0856,
            lng: -34.8916,
            type: "Tipo 2 (AC)",
            speed: "Média (22kW)",
            power: 22,
            distance: 0.5,
            rating: 4.2,
            favorite: true,
            available: true,
          },
          // ... outros dados de fallback se necessário
        ]

        allStations = fallbackStations
        filterStations("closest")
      })
  }

  function renderStations(stations) {
    const container = document.querySelector(".stations-list")
    if (!container) {
      console.error("Container de estações não encontrado")
      return
    }
    container.innerHTML = ""

    stations.forEach((estacao) => {
      const div = document.createElement("div")
      div.classList.add("station-item")

      div.innerHTML = `
      <div class="station-icon ${!estacao.available ? "unavailable" : ""}">
        <i class="fas fa-charging-station station-icon-inner"></i>
        </div>
        <div class="station-info">
        <h3 class="station-name">${estacao.name}</h3>
        <p class="station-details">${estacao.type} - ${estacao.speed}</p>
        <p class="station-distance">${estacao.distance} km de distância</p>
        </div>
        <span class="favorite-icon" data-id="${
          estacao.id
        }" style="cursor: pointer;">
          <i class="${
            estacao.favorite ? "fa-solid" : "fa-regular"
          } fa-heart"></i>
        </span>
      `

      // Abre modal ao clicar na estação (exceto no coração)
      div.addEventListener("click", () => {
        openModal(estacao)
      })

      container.appendChild(div)
    })

    // Clique para favoritar (ícone de coração)
    document.querySelectorAll(".favorite-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.stopPropagation() // impede que clique no ícone abra o modal

        const id = icon.dataset.id
        const est = allStations.find((e) => e.id == id)
        est.favorite = !est.favorite

        renderStations(stations) // re-renderiza a lista
      })
    })
  }

  function renderMapMarkers(stations) {
    markers.forEach((marker) => map.removeLayer(marker))
    markers = []

    stations.forEach((station) => {
      const marker = L.marker([station.lat, station.lng], {
        icon: createStationIcon(station),
      }).addTo(map).bindPopup(`
        <strong>${station.name}</strong><br>
        Tipo: ${station.type}<br>
        Velocidade: ${station.speed}<br>
        Distância: ${station.distance} km<br>
        Avaliação: ${station.rating} ★<br>
        Status: ${station.available ? "Disponível" : "Indisponível"}
      `)
      markers.push(marker)
    })
  }

  // Adicione esta função para criar ícones de estações
  function createStationIcon(station) {
    const availableColor = "#4caf50"
    const unavailableColor = "#e74c3c"

    const iconHtml = `
    <div class="custom-icon" style="position: relative; width: 2.5em; height: 2.5em;">
      <i class="fa-solid fa-location-pin" style="
        position: absolute;
        top: 0;
        left: 0;
        font-size: 2.5em;
        color: ${station.available ? availableColor : unavailableColor};
      "></i>
      <i class="fa-solid fa-bolt" style="
        position: absolute;
        top: 40%;
        left: 39%;
        transform: translate(-50%, -50%);
        font-size: 1.2em;
        color: black;
        z-index: 2;
      "></i>
      ${
        !station.available
          ? `
      <span style="
        position: absolute;
        top: 40%;
        left: 39%;
        width: 1.5em;
        height: 2px;
        background: ${unavailableColor};
        transform: translate(-50%, -50%) rotate(45deg);
        z-index: 3;
      "></span>
      `
          : ""
      }
    </div>
  `

    return L.divIcon({
      html: iconHtml,
      iconSize: [30, 30],
      className: "custom-station-icon",
    })
  }

  function filterStations(tipo) {
    let estacoesFiltradas = [...allStations]

    switch (tipo) {
      case "favorites":
        estacoesFiltradas = estacoesFiltradas.filter((e) => e.favorite)
        break
      case "fastest":
        estacoesFiltradas.sort((a, b) => b.power - a.power)
        break
      case "best-rated":
        estacoesFiltradas.sort((a, b) => b.rating - a.rating)
        break
      case "closest":
      default:
        estacoesFiltradas.sort((a, b) => a.distance - b.distance)
    }

    renderStations(estacoesFiltradas)
    renderMapMarkers(estacoesFiltradas)
  }

  async function calculateRoute() {
const destinationInput = document.getElementById("destination").value;

  if (!destinationInput) {
    alert("Por favor, preencha o destino.");
    return;
  }

  let origin = null;
  const originInput = document.getElementById("origin").value;

  if (originInput.trim()) {
    origin = await geocodeAddress(originInput);
  } else {
    origin = await getCurrentLocation();
    if (!origin) {
      alert("Não foi possível obter sua localização atual.");
      return;
    }
  }

  const destination = await geocodeAddress(destinationInput);

  if (!origin || !destination) {
    alert("Endereço inválido. Por favor, verifique os endereços informados.");
    return;
  }

  // Limpa qualquer rota existente
  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }
  if (originMarker) {
    map.removeLayer(originMarker);
    originMarker = null;
  }
  if (destinationMarker) {
    map.removeLayer(destinationMarker);
    destinationMarker = null;
  }

  // Cria marcadores personalizados
  originMarker = L.marker([origin.lat, origin.lon], {
    icon: createCustomIcon('origin')
  }).addTo(map).bindPopup("Origem");

  destinationMarker = L.marker([destination.lat, destination.lon], {
    icon: createCustomIcon('destination')
  }).addTo(map).bindPopup("Destino");

  // Usa a API de roteamento do OSRM
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      // Verifica se a geometria existe e está no formato esperado
      if (!route.geometry || !route.geometry.coordinates) {
        throw new Error("Formato de geometria inválido na resposta da API");
      }

      // Cria a linha da rota
      const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      routeLine = L.polyline(routeCoordinates, {
        color: '#000000',
        weight: 5,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo(map);

      // Centraliza o mapa para mostrar toda a rota
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds);
      
      // Filtra estações próximas à rota
      filterStationsNearRoute(origin, destination);
    } else {
      alert("Não foi possível calcular a rota. A API não retornou rotas válidas.");
    }
  } catch (error) {
    console.error("Erro ao calcular rota:", error);
    alert(`Erro ao calcular rota: ${error.message}`);
  }
}

function filterStationsNearRoute(origin, destination) {
  // Calcula o ponto médio da rota para usar como referência
  const midPoint = {
    lat: (origin.lat + destination.lat) / 2,
    lon: (origin.lon + destination.lon) / 2
  };

  // Filtra estações dentro de 5km do ponto médio
  const R = 6371; // Raio da Terra em km
  const maxDistance = 5; // 5km

  const stationsNearRoute = allStations.filter(station => {
    const dLat = (station.lat - midPoint.lat) * Math.PI / 180;
    const dLon = (station.lng - midPoint.lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(midPoint.lat * Math.PI/180) * 
      Math.cos(station.lat * Math.PI/180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance <= maxDistance;
  });

  renderStations(stationsNearRoute);
  renderMapMarkers(stationsNearRoute);
}

// Adicione esta função para criar ícones personalizados
function createCustomIcon(type) {
  let html, iconSize;
  
  if (type === 'origin') {
    html = '<i class="fa-solid fa-map-pin" style="color: #000000; font-size: 2em;"></i>';
    iconSize = [30, 30];
  } else if (type === 'destination') {
    html = '<i class="fa-solid fa-flag-checkered" style="color: #000000; font-size: 1.5em;"></i>';
    iconSize = [30, 30];
  }
  
  return L.divIcon({
    html: html,
    iconSize: iconSize,
    className: 'custom-marker-icon'
  });
  }

  async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("Geolocalização não é suportada neste navegador.")
        return resolve(null)
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Erro ao obter localização:", error)
          alert("Não foi possível obter sua localização.")
          resolve(null)
        }
      )
    })
  }

  function applyFilters() {
    // Obter valores dos checkboxes
    const selectedTypes = Array.from(
      document.querySelectorAll(
        '.filter-group:nth-child(1) input[type="checkbox"]:checked'
      )
    ).map((checkbox) => checkbox.parentElement.textContent.trim())

    const selectedSpeeds = Array.from(
      document.querySelectorAll(
        '.filter-group:nth-child(2) input[type="checkbox"]:checked'
      )
    ).map((checkbox) => checkbox.parentElement.textContent.trim())

    const onlyAvailable =
      document.querySelector(
        '.filter-group:nth-child(3) input[type="checkbox"]:checked'
      ) !== null

    console.log("Filtros aplicados:", {
      selectedTypes,
      selectedSpeeds,
      onlyAvailable,
    })

    // Recarregar estações com filtros
    loadStations()
  }

  async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address
    )}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      console.log(`Resultado da geocodificação para "${address}":`, data)

      if (data.length > 0 && data[0].lat && data[0].lon) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        }
      } else {
        console.warn(`Endereço não encontrado: ${address}`)
        return null
      }
    } catch (error) {
      console.error("Erro ao geocodificar endereço:", error)
      return null
    }
  }
})

function setupAutocomplete(inputId) {
  const input = document.getElementById(inputId)
  const listId = inputId + "-autocomplete-list"
  let list = document.createElement("div")
  list.setAttribute("id", listId)
  list.setAttribute("class", "autocomplete-items")
  input.parentNode.appendChild(list)

  input.addEventListener("input", async function () {
    const query = this.value.trim()
    if (query.length < 3) {
      list.innerHTML = ""
      return
    }

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
    )
    const results = await response.json()

    list.innerHTML = ""
    results.features.forEach((feature) => {
      const option = document.createElement("div")
      option.innerHTML =
        feature.properties.name +
        (feature.properties.city ? ", " + feature.properties.city : "")
      option.addEventListener("click", () => {
        input.value = option.innerHTML
        list.innerHTML = ""
      })
      list.appendChild(option)
    })
  })

  document.addEventListener("click", function (e) {
    if (e.target !== input && e.target.parentNode !== list) {
      list.innerHTML = ""
    }
  })
}
