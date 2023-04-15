import { create } from 'zustand';
import produce from 'immer';

const robotFormDefaults = {
  robotFormBasic: {
    firstName: 'SampleFirstName',
    lastName: 'SampleLastName',
    password: '',
    maidenName: 'SampleMaidenName',
    email: 'email@email.com',
    birthdate: '2000-01-01',
    age: '10',
    phone: '+1 111-111-1111',
    university: 'Sample University',
  },
  robotFormAppearance: {
    image: `https://robohash.org/${Date.now().toString().slice(-9)}.png`,
    bloodGroup: 'O',
    eyeColor: 'Brown',
    hair: { color: 'Brown', type: 'Curly' },
    height: '186',
    weight: '54.4',
  },
  robotFormLocation: {
    address: '8376 Albacore Drive',
    city: 'Pasadena',
    postalCode: '21122',
    state: 'MD',
    coordinates: { lat: '39.110409', lng: '-76.46565799999999' },
  },
  robotFormFinancial: {
    cardExpire: '06/22',
    cardNumber: '3565600124206309',
    cardType: 'jcb',
    currentcy: 'Krona',
    iban: 'FR19 2200 9407 28AH Q2CV AT31 S49',
  },
  robotFormMisc: {
    macAddress: 'E1:00:69:FF:2D:94',
    ein: '02-4892541',
    userAgent:
      'Mozilla/5.0 (Windows; U; Windows NT 6.0; ja-JP) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16',
    domain: 'odnoklassniki.ru',
  },
  robotFormToc: ['Basic', 'Appearance', 'Location', 'Financial', 'Misc'],
};

const {
  robotFormBasic,
  robotFormAppearance,
  robotFormLocation,
  robotFormFinancial,
  robotFormMisc,
  robotFormToc,
} = robotFormDefaults;

const useFormStore = create((set, get) => ({
  page: 0,
  launchedForm: false,
  // robotFormBasic,
  // robotFormAppearance,
  // robotFormLocation,
  // robotFormFinancial,
  // robotFormMisc,
  // robotFormToc,
  ...robotFormDefaults,
  toggleFormStatus: (status) => set(() => ({ launchedForm: status })),
  prevPage: (data) => {
    // console.log(`zustand: prevPage`);
    set((state) => ({ ...data, page: state.page - 1 }));
  },
  nextPage: (data) => {
    // console.log(`zustand: nextPage`);
    set((state) => ({ ...data, page: state.page + 1 }));
  },
  // onSubmit: (data) => set({ ...data, page: 5 }),
  onSubmit: (data) => {
    console.table(`onSubmit: outer:`, data);
    return set(
      produce((draft) => {
        console.table(`onSubmit: inner:`, draft, data);
        const newDraft = { ...draft, ...data };
        newDraft.page = 5;
        return newDraft;
      })
    );
  },
  // onsubmit: (data) => {
  //   console.log(`data`, data);
  //   set(
  //     produce((draft) => {
  //       console.table(`onSubmit:`, draft, data);
  //       for (const input in data) {
  //         draft.input = data.input;
  //       }
  //       draft.page = 4;
  //     })
  //   );
  // },

  //   return {...data, draft.page: 5 }
  //    ))),
  readFormToc: (formName, currentPage) => {
    try {
      return get()[`${formName}Toc`][currentPage];
    } catch (err) {
      return err;
    }
  },
  readFormCategory: (formName, tocName) => get()[`${formName}${tocName}`],
  readFormCategoryValue: (category, key) => category[key],
}));

export default useFormStore;
