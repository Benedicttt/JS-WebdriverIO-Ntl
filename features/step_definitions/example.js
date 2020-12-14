var config = require('./../../wdio.conf.js').config;
var chai = require('chai');
var expect = chai.expect;    // Using Expect style
var {defineSupportCode} = require('cucumber');


defineSupportCode(function ({And, But, Given, Then, When}) {

    Given(/^Открыта страница сайта "\/doctor"$/, { retry: 2 }, function () {
        browser.url(config.baseUrl);

        expect(browser.getTitle()).to.equal('DocDoc - сервис поиска врача и записи на прием');

        $("[data-test-id=city_select_button]").click();
        $("//span[@class='select-box__options-item-title'][contains(text(), 'Санкт-Петербург')]").click();

        $("div.search__field.search__field_zoom > input").setValue('Диетолог');
        $("div.search__field.search__field_select > input").setValue('Автово');
        $('.button_search').click()
    });

    Then(/^Отображается кнопка "Расписание \(фильтр\)"$/, { retry: 2 }, function () {
        const btn_filter = browser.element(".date-filter");
        btn_filter.waitForVisible(config.deafultTimeout);

        expect(btn_filter.isVisible()).to.equal(true);
    });

    Then(/^Заголовок кнопки "Расписание \(фильтр\)"([^"]*)""([^"]*)"Расписание на все дни"([^"]*)""$/, { retry: 2 }, function (a1, a2, a3) {
        const name_button = browser.element(".date-filter").getText().split("   ");

        expect(name_button[0]).to.equal("Расписание на все дни");
        expect(name_button.length).to.equal(1) // вообще их две но webdriverio смотри на те что видимы по этому 1, потому что видима на странице 1 кнопка
    });

    When(/^Нажимаем на кнопку "Расписание \(фильтр\)"$/, { retry: 2 }, function () {
        browser.scroll(".date-filter", 0, -500);
        browser.pause(300);
        $(".date-filter").click();
    });

    Then(/^Отображается элемент "([^"]*)"$/, { retry: 2 }, function (a1) {
        const list_date = browser.element("div.select-box.--opened");
        list_date.waitForVisible(config.deafultTimeout);

        expect(list_date.isVisible()).to.equal(true);
    });

    Then(/^Помечен галочкой пункт "([^"]*)" в выпадающем списке "([^"]*)"$/, { retry: 2 }, function (a1, a2) {
        const checked = $(".select-box__options-item.--active").getText();

        expect(checked).to.equal("Все дни");
    });

    When(/^Нажимаем на пункт "([^"]*)" в выпадающем списке "([^"]*)"$/, { retry: 2 }, function (a1, a2) {
        $("//span[@class='select-box__options-item-title'][contains(text(), 'Завтра')]").click();
    });

    Then(/^Заголовок кнопки "Расписание \(фильтр\)"([^"]*)""([^"]*)"Расписание на завтра"([^"]*)""$/, { retry: 2 }, function (a1, a2, a3) {
        const name_button = browser.element(".date-filter").getText().split("   ");

        expect(name_button[0]).to.equal("Расписание на завтра");
    });

    Then(/^Отображаются врачи, работающие в выбранный день$/, function () {
        const list_name = $$(".doctor-card-name");
        expect(list_name.length > 1).to.equal(true)
        console.log("Врачей в списке: " + list_name.length)
    });
});