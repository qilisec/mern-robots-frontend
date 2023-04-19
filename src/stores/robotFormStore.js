import { create } from 'zustand';
import produce from 'immer';

const formDefaults = {
  robotFormDefaults: {
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
  },
};

const {
  robotFormBasic,
  robotFormAppearance,
  robotFormLocation,
  robotFormFinancial,
  robotFormMisc,
  robotFormToc,
} = formDefaults.robotFormDefaults;

const useFormStore = create((set, get) => ({
  lastError: '',
  logLastError: (message) => set((state) => ({ lastError: message })),
  page: 0,
  formInputPrefill: null,
  launchedForm: false,
  robotFormBasic,
  robotFormAppearance,
  robotFormLocation,
  robotFormFinancial,
  robotFormMisc,
  robotFormToc,
  // ...robotFormDefaults,
  toggleFormStatus: (status) => set(() => ({ launchedForm: status })),
  resetForm: () => set((state) => ({ page: (state.page = 0) })),
  toggleFormInputFill: (formType) => {
    if (formType !== null) {
      set(
        produce((draft) => {
          const defaultsSelector = `${formType}Defaults`;
          return { ...formDefaults[defaultsSelector] };
        })
      );
    } else {
      set(
        produce((state, draft) => {
          const toc = state.robotFormToc.map((field) => `robotForm${field}`);
          toc.map((field) => {
            draft.field = { ...field };
            console.log(`toc map`, field);
            return Object.keys(draft.field).map(
              (fieldProperty) => (draft[`${field}`][`${fieldProperty}`] = null)
              // (fieldProperty) => (draft.field.fieldProperty = null)
            );
            // draft
          });
          console.log(`toggleFormInputField draft:`, draft);
          // return { ...draft };
        })
      );
    }
  },
  prevPage: (data) => {
    // console.log(`zustand: prevPage`, data);
    return set((state) => ({ ...data, page: state.page - 1 }));
  },
  nextPage: (data) => {
    console.log(`zustand: nextPage`, data);
    return set((state) => ({ ...data, page: state.page + 1 }));
  },
  updateForm: (data) => {
    console.log(`zustand: updateForm`, data);
    return set(() => ({ ...data }));
  },
  // onSubmit: (data) => {
  //   console.log(`zustand: onSubmit`, data);
  //   return set(() => ({ ...data, page: 5 }));
  // },
  // Not sure if this immer implementation is correct
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
  readFormToc: (formName, currentPage) => {
    try {
      console.count(`readFormToc invoked`);
      return get()[`${formName}Toc`][currentPage];
    } catch (err) {
      return err;
    }
  },
  readFormCategory: (formName, tocName) => {
    console.count(`readFormCategory invoked`);
    return get()[`${formName}${tocName}`];
  },
  readFormCategoryValue: (category, key) => {
    console.count(`readFormCategoryValue invoked`);
    return category[key];
  },
}));

export default useFormStore;
