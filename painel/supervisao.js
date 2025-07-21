let bloqueado = false;
    let menuAtivo = false;

function ListOn() {
  if (bloqueado) return;
  bloqueado = true;

  const icon = document.querySelector('.header i');

  icon.classList.add('fade-out');

  setTimeout(() => {
    // Troca o ícone
    const isBars = icon.classList.contains('fa-bars');
    icon.classList.remove('fade-out');
    icon.classList.remove(isBars ? 'fa-bars' : 'fa-xmark');
    icon.classList.add(isBars ? 'fa-xmark' : 'fa-bars');

    // Aplica fade-in
    icon.classList.add('fade-in');

    setTimeout(() => {
      icon.classList.remove('fade-in');
      bloqueado = false;
    }, 300);

  }, 300);

  // Alterna o menu
  const list = document.querySelector('.header-list');
  list.classList.toggle('on');
  if (list.classList.contains('on')) {
    menuAtivo = true;
  } else {
    menuAtivo = false;
  }
}

    function ativarMenu() {
        if (!menuAtivo) {
            ListOn();
        }
    }

    function Ativar(element) {
        element.classList.add('ativo');
    }
    function Desativar(element) {
        element.classList.remove('ativo');
    }