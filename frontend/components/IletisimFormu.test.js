import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    render (<IletisimFormu />)
});

test('iletişim formu headerı render ediliyor', () => {
    render (<IletisimFormu/>)

    const header = screen.getByText(/İletişim Formu/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();

});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render (<IletisimFormu/>);

    const adInput= screen.getByLabelText("Ad*");
    userEvent.type(adInput,"nrgs");
    const error =await screen.findAllByTestId("error"); 

    expect(error).toHaveLength(1);

});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render (<IletisimFormu/>);

    const button = screen.getByRole("button");
    userEvent.click(button);
    const err = await screen.findAllByTestId("error");

    expect(err).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);

    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput,"nergis");
    const soyAdInput = screen.getByLabelText("Soyad*");
    userEvent.type(soyAdInput,"armagan");
    const button = screen.getByRole("button");
    userEvent.click(button);
    const err = await screen.findAllByTestId("error");

    expect(err).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render (<IletisimFormu/>)

    const emailInput= screen.getByLabelText("Email*");
    userEvent.type(emailInput,"armaganergis");
    const err = await screen.findByText(/email geçerli bir email adresi olmalıdır./i);

    expect(err).toBeInTheDocument();

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render (<IletisimFormu/>)

    const button = screen.getByRole("button");
    userEvent.click(button);
    const err = await screen.findByText(/soyad gereklidir./i);

    expect(err).toBeInTheDocument();

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render (<IletisimFormu/>)

    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput,"nergis");
    const soyAdInput = screen.getByLabelText("Soyad*");
    userEvent.type(soyAdInput,"armagan");
    const emailInput= screen.getByLabelText("Email*");
    userEvent.type(emailInput,"armaganergis@gmail.com");
    const button = screen.getByRole("button");
    userEvent.click(button);

    const ad = screen.queryByText("nergis")
    expect(ad).toBeInTheDocument();
    const soyad = screen.queryByText("armagan");
    expect(soyad).toBeInTheDocument();
    const email = screen.queryByText("armaganergis@gmail.com");
    expect(email).toBeInTheDocument();
    const message = screen.queryByText("messageDisplay");
    expect(message).not.toBeInTheDocument();
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>)

    const ad = screen.getByLabelText("Ad*");
    userEvent.type(ad,"nergis");
    const soyad = screen.getByLabelText("Soyad*");
    userEvent.type(soyad,"armagan");
    const email= screen.getByLabelText("Email*");
    userEvent.type(email,"armaganergis@gmail.com");
    const mesaj= screen.getByLabelText("Mesaj");
    userEvent.type(mesaj,"mesajım var");
    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor(()=>{
        const ad = screen.queryByText("nergis");
        expect(ad).toBeInTheDocument();
        const soyad = screen.queryByText("armagan");
        expect(soyad).toBeInTheDocument();
        const email = screen.queryByText("armaganergis@gmail.com");
        expect(email).toBeInTheDocument();
        const mesaj = screen.queryByText("mesajım var");
        expect(mesaj).toBeInTheDocument();
    })

});
