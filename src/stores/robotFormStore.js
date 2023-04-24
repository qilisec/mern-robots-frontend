/* eslint-disable operator-assignment */
import { create } from 'zustand';
import { produce, setAutoFreeze } from 'immer';

setAutoFreeze(false);

const formDefaults = {
  robotFormDefaults: {
    robotFormBasic: {
      firstName: 'SampleFirstName',
      lastName: 'SampleLastName',
      password: '',
      maidenName: 'SampleMaidenName',
      email: 'email@email.com',
      birthDate: '2000-01-01',
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
      currency: 'Krona',
      iban: 'FR19 2200 9407 28AH Q2CV AT31 S49',
    },
    robotFormMisc: {
      macAddress: 'E1:00:69:FF:2D:94',
      ein: '02-4892541',
      userAgent:
        'Mozilla/5.0 (Windows; U; Windows NT 6.0; ja-JP) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16',
      domain: 'odnoklassniki.ru',
    },
    robotFormToc: [
      'robotFormBasic',
      'robotFormAppearance',
      'robotFormLocation',
      'robotFormFinancial',
      'robotFormMisc',
    ],
    robotSchema: {
      robotFormBasic: '',
      robotFormAppearance: '',
      robotFormLocation: 'address',
      robotFormFinancial: 'bank',
      robotFormMisc: '',
    },
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
  formSubmission: {},
  formInputPrefill: null,
  launchedForm: false,
  // robotFormBasic,
  // robotFormAppearance,
  // robotFormLocation,
  // robotFormFinancial,
  // robotFormMisc,
  // robotFormToc,
  ...formDefaults.robotFormDefaults,
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
    // ALERT: When next/prev page used immer code, the form component crashed if user clicked next page > prev page. Error was "Cannot assign to read only property". Had to set immer "autofreeze" setting to false.
    // set(
    //   produce((draft) => {
    //     Object.keys(data).map((field) => {
    //       const fieldValue = data[field];
    //       return (draft[field] = fieldValue);
    //     });
    //     draft.page = draft.page - 1;
    //   })
    // );
  },
  nextPage: (data) => {
    // console.log(`zustand: nextPage`, data);
    return set((state) => ({ ...data, page: state.page + 1 }));
    // set(
    //   produce((draft) => {
    //     Object.keys(data).map((field) => {
    //       const fieldValue = data[field];
    //       return (draft[field] = fieldValue);
    //     });
    //     draft.page += 1;
    //   })
    // );
  },
  updateForm: (data) => {
    console.log(`zustand: updateForm`, data);
    return set(() => ({ ...data }));
  },
  onSubmit: (data, formName) => {
    const formToc = get()[`${formName}Toc`];
    set(
      produce((draft) => {
        formToc.map((category) => {
          const schemaCategory = get().convertFormTocToSchema(category);
          const categoryInfo = get().readFormCategory(category);
          return Object.keys(categoryInfo).map((field) => {
            const fieldValue = data[category]
              ? data[category][field]
              : categoryInfo[field];

            console.table(`onSubmit mapping:`, { category, field, fieldValue });
            // NOTE: Can't use .field because that returns static "field" property: {"field": fieldValue}
            // draft.formSubmission.field = fieldValue;
            // console.log(`onSubmit field:`, field);
            if (schemaCategory && !draft.formSubmission[schemaCategory])
              draft.formSubmission[schemaCategory] = {};
            schemaCategory
              ? (draft.formSubmission[schemaCategory][field] = fieldValue)
              : (draft.formSubmission[field] = fieldValue);
            draft[category][field] = fieldValue;
            return draft;
          });
        });
        draft.page = 5;
      })
    );
    return get().formSubmission;
  },
  readFormToc: (formName, currentPage) => {
    try {
      // console.count(`readFormToc invoked`);
      return get()[`${formName}Toc`][currentPage];
    } catch (err) {
      return err;
    }
  },
  // readFormCategory: (formName, tocName) => {
  readFormCategory: (categoryName) => {
    // console.count(`readFormCategory invoked`);
    return get()[categoryName];
  },
  readFormCategoryValue: (categoryName, key) => {
    // console.count(`readFormCategoryValue invoked`);
    return categoryName[key];
  },
  convertFormTocToSchema: (formCategory) => get().robotSchema[formCategory],
}));

export default useFormStore;
