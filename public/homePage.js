const logoutButton = new LogoutButton();

logoutButton.action = function () {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function updateRates() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

updateRates(); // первый запуск
setInterval(updateRates, 60000); // каждую минуту

const moneyManager = new MoneyManager();

// Пополнение счёта
moneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Счёт пополнен");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

// Конвертация валют
moneyManager.conversionMoneyCallback = function (data) {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Конвертация выполнена");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

// Перевод средств
moneyManager.sendMoneyCallback = function (data) {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Перевод выполнен");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

const favoritesWidget = new FavoritesWidget();

// Получение начального списка
ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

// Добавление пользователя
favoritesWidget.addUserCallback = function (data) {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(true, "Пользователь добавлен в избранное");
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
};

// Удаление пользователя
favoritesWidget.removeUserCallback = function (id) {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(true, "Пользователь удалён из избранного");
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
};
