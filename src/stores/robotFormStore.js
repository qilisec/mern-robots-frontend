/* eslint-disable operator-assignment */
import { create } from 'zustand';
import { produce, setAutoFreeze } from 'immer';

const { log } = console;
setAutoFreeze(false);

const formDefaults = {
  robotForm: {
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
    robotFormSchema: {
      robotFormBasic: '',
      robotFormAppearance: '',
      robotFormLocation: 'address',
      robotFormFinancial: 'bank',
      robotFormMisc: '',
    },
  },
};

const { robotForm } = formDefaults;
const formValidation = {
  robotForm: {
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

const useFormStore = create((set, get) => ({
  lastError: '',
  logLastError: (message) => set((state) => ({ lastError: message })),
  page: 0,
  formSubmission: {},
  formDefaultFill: true,
  launchedForm: false,
  forms: { robotForm },
  formValidation,
  toggleFormStatus: (status) => set(() => ({ launchedForm: status })),
  resetFormProgress: () => set(() => ({ page: 0 })),
  prevPage: (formName, data) => {
    console.log(`zustand: prevPage`, data);
    // ALERT: When next/prev page used immer code, the form component crashed if user clicked next page > prev page. Error was "Cannot assign to read only property". Had to set immer "autofreeze" setting to false.
    set(
      produce((draft) => {
        Object.keys(data).map((field) => {
          const fieldValue = data[field];
          return (draft.forms[formName][field] = fieldValue);
        });
        draft.page = draft.page - 1;
      })
    );
  },

  nextPage: (formName, data) => {
    console.log(`zustand: nextPage`, data);
    set(
      produce((draft) => {
        Object.keys(data).map((field) => {
          const fieldValue = data[field];
          return (draft.forms[formName][field] = fieldValue);
        });
        draft.page += 1;
      })
    );
  },

  toggleFormDefaultFill: (formName) => {
    const reloadDefaults = get().formDefaultFill ? {} : get().forms[formName];
    set((state) => ({
      ...reloadDefaults,
      formDefaultFill: !state.formDefaultFill,
    }));
  },
  onSubmit: (data, formName) => {
    console.log(`zustand onSubmit: data:`, data);
    const formToc = get().forms[formName][`${formName}Toc`];
    set(
      produce((draft) => {
        formToc.map((category) => {
          // We fill out the payload by going through each input field, getting the most recent value, making necessary conversions between the frontend form layou and the backend schema, and finally adding that modified data to a form submission object that we send to the backend for saving to our db.
          const schemaCategory = get().convertFormTocToSchema(
            formName,
            category
          );
          const categoryInfo = get().readFormCategory(formName, category);

          // const categoryInfo = get().readFormCategory(category);
          return Object.keys(categoryInfo).map((field) => {
            // Retrieve the form input values: Either from submitted data (preferably) or from reading state
            const fieldValue = data[category]
              ? data[category][field]
              : categoryInfo[field];

            console.table(`onSubmit mapping:`, { category, field, fieldValue });
            // NOTE: Can't use .field because that returns static "field" property: {"field": fieldValue}
            // draft.formSubmission.field = fieldValue;

            // If schemaCategory does not already exist on formSubmission object, instantiate an empty object
            if (schemaCategory && !draft.formSubmission[schemaCategory])
              draft.formSubmission[schemaCategory] = {};

            // Fill schemaCategory with form inputs
            schemaCategory
              ? (draft.formSubmission[schemaCategory][field] = fieldValue)
              : (draft.formSubmission[field] = fieldValue);

            // Update existing form data (as with prev and next page navigation) so that result page shows the changes made on last page prior to form submission
            draft.forms[formName][category][field] = fieldValue;
            return draft;
          });
        });
        draft.page = 5;
      })
    );
    return get().formSubmission;
  },
  // onSubmit: (data, formName) => {
  //   const formToc = get()[`${formName}Toc`];
  //   set(
  //     produce((draft) => {
  //       formToc.map((category) => {
  //         const schemaCategory = get().convertFormTocToSchema(category);
  //         const categoryInfo = get().readFormCategory(category);
  //         return Object.keys(categoryInfo).map((field) => {
  //           const fieldValue = data[category]
  //             ? data[category][field]
  //             : categoryInfo[field];

  //           console.table(`onSubmit mapping:`, { category, field, fieldValue });
  //           // NOTE: Can't use .field because that returns static "field" property: {"field": fieldValue}
  //           // draft.formSubmission.field = fieldValue;
  //           // console.log(`onSubmit field:`, field);
  //           if (schemaCategory && !draft.formSubmission[schemaCategory])
  //             draft.formSubmission[schemaCategory] = {};
  //           schemaCategory
  //             ? (draft.formSubmission[schemaCategory][field] = fieldValue)
  //             : (draft.formSubmission[field] = fieldValue);
  //           draft[category][field] = fieldValue;
  //           return draft;
  //         });
  //       });
  //       draft.page = 5;
  //     })
  //   );
  //   return get().formSubmission;
  // },
  readFormToc: (formName, currentPage) => {
    try {
      // console.count(`readFormToc invoked`);
      return get().forms[formName][`${formName}Toc`][currentPage];
    } catch (err) {
      return err;
    }
  },
  // readFormToc: (formName, currentPage) => {
  //   try {
  //     // console.count(`readFormToc invoked`);
  //     return get()[`${formName}Toc`][currentPage];
  //   } catch (err) {
  //     return err;
  //   }
  // },
  // readFormCategory: (formName, tocName) => {
  readFormCategory: (formName, categoryName) => {
    return get().forms[formName][categoryName];
  },
  // readFormCategory: (categoryName) => {
  //   // console.count(`readFormCategory invoked`);
  //   return get()[categoryName];
  // },
  // readFormCategoryValue as written bellow is the same as object[key] (i.e. completely redundant). categoryName is actually an object. It would only have value as a function if categoryName was actually a string.
  // readFormCategoryValue: (categoryName, key) => {
  //   // console.count(`readFormCategoryValue invoked`);
  //   return categoryName[key] ?? '';
  // },
  readFormCategoryValue: (formName, categoryName, key) => {
    // console.count(`readFormCategoryValue invoked`);
    return get().forms[formName][categoryName][key] ?? '';
  },
  // formCategory = "robotFormBasic"
  convertFormTocToSchema: (formName, formCategory) => {
    console.log(
      `convertFormTocToSchema`,
      get().forms[formName][`${formName}Schema`][formCategory]
    );
    return get().forms[formName][`${formName}Schema`][formCategory];
  },

  readFormValidation: (formName, formCategory, formField, subfield = null) => {
    return get().formValidation[formName][formCategory][formField]?.[subfield];
  },
}));

export default useFormStore;
