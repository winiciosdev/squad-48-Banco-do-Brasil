function calcularAutonomia() {
    const capacidade = parseFloat(document.getElementById("capacidade").value);
    const consumo = parseFloat(document.getElementById("consumo").value);
    const nivel = parseFloat(document.getElementById("nivel").value);
    const resultado = document.getElementById("resultado");

    if (isNaN(capacidade) || isNaN(consumo) || isNaN(nivel)) {
      resultado.textContent = "Preencha todos os campos corretamente!";
      return;
    }

    const energiaDisponivel = capacidade * (nivel / 100);
    const autonomia = (energiaDisponivel / consumo) * 100;

    resultado.textContent = `Autonomia estimada: ${autonomia.toFixed(1)} km`;
  }