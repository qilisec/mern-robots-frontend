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

const formValidation = {
  robotForm: {
    robotFormBasic: {
      firstName: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z]+$/,
          message: 'Can only contain alphabet characters',
        },
      },
      lastName: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z]+$/,
          message: 'Can only contain alphabet characters',
        },
      },
      password: { required: 'Password is required' },
      maidenName: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z]+$/,
          message: 'Can only contain alphabet characters',
        },
      },
      email: {
        required: 'Required',
        pattern: {
          value:
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
          message: 'Must be a valid email address',
        },
      },
      birthDate: {
        required: 'Required',
        pattern: {
          value: /^[0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,2}$/,
          message:
            'Must be a valid birthday (Numbers, dashes, and slashes only)',
        },
      },
      age: {
        required: 'Required',
        pattern: {
          value: /^(1\d\d|[1-9]\d|[1-9])$/,
          message: 'Must be a valid age (numbers only)',
        },
      },
      phone: {
        required: 'Required',
        pattern: {
          value:
            /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
          message:
            'Must be a valid phone number (Numbers, dashes, and dots only)',
        },
      },
      university: {
        pattern: {
          value: /^[A-Za-z. (&-)]+$/,
          message: 'University name was not valid',
        },
      },
    },
    robotFormAppearance: {
      image: {
        required: 'Required',
        pattern: {
          value:
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
          message: 'Not a valid URL',
        },
      },
      bloodGroup: {
        required: 'Required',
        pattern: {
          value: /^(O|A|B|AB)$/,
          message: 'Only O, A, B, and AB permitted',
        },
      },
      eyeColor: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z-]+$/,
          message: 'Can only contain alphabet characters and dashes',
        },
      },
      hair: {
        color: {
          required: 'Required',
          pattern: {
            value: /^[A-Za-z -]+$/,
            message: 'Can only contain alphabet characters, dashes, and spaces',
          },
        },
        type: {
          required: 'Required',
          pattern: {
            value: /^[A-Za-z -]+$/,
            message: 'Can only contain alphabet characters, dashes, and spaces',
          },
        },
      },
      height: {
        required: 'Required',
        pattern: {
          value: /^[\d]+(\.\d)?$/,
          message: 'Can only contain numbers and dots',
        },
      },
      weight: {
        required: 'Required',
        pattern: {
          value: /^[\d]+(\.\d)?$/,
          message: 'Can only contain numbers and dots',
        },
      },
    },
    robotFormLocation: {
      address: {
        required: 'Required',
        pattern: { value: /^\S.*/, message: 'Must be a valid address' },
      },
      city: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z -]+$/,
          message: 'Can only contain alphabet characters, dashes, and spaces',
        },
      },
      postalCode: {
        required: 'Required',
        pattern: {
          value: /^[0-9]{5}(?:-[0-9]{4})?$/,
          message: 'Must be a valid zipcode',
        },
      },
      state: {
        required: 'Required',
        pattern: {
          value: /^[A-Z]{2}$/,
          message: 'Must be a valid 2 character state abbreviation',
        },
      },
      coordinates: {
        lat: {
          required: 'Required',
          pattern: {
            value: /^-?[\d]+(\.\d+)?$/,
            message: 'Can only contain numbers, dots, and dashes',
          },
        },
        lng: {
          required: 'Required',
          pattern: {
            value: /^-?[\d]+(\.\d+)?$/,
            message: 'Can only contain numbers, dots, and dashes',
          },
        },
      },
    },
    robotFormFinancial: {
      cardExpire: {
        required: 'Required',
        pattern: { value: /^\d{2}\/\d{2}$/, message: 'Format must be MM/YY' },
      },
      cardNumber: {
        required: 'Required',
        pattern: {
          value: /^[\d ]+$/,
          message: 'Can only contain numbers and spaces',
        },
      },
      cardType: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z ]+$/,
          message: 'Can only contain alphabet characters and spaces',
        },
      },
      currency: {
        required: 'Required',
        pattern: {
          value: /^[A-Za-z-]+$/,
          message: 'Can only contain alphabet characters and dashes',
        },
      },
      iban: {
        required: 'Required',
        pattern: {
          value:
            /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/,
          message: 'Must be a valid Iban',
        },
      },
    },
    robotFormMisc: {
      macAddress: {
        required: 'Required',
        pattern: {
          value: /^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/,
          message: 'Must be a valid MAC address',
        },
      },
      ein: {
        required: 'Required',
        pattern: { value: /^\d{2}-\d{7}$/, message: 'Must be a valid EIN' },
      },
      userAgent: {
        required: 'Required',
        pattern: { value: /^\S.*/, message: 'Must be a valid user agent' },
      },
      domain: {
        required: 'Required',
        pattern: { value: /^\S+\.\S+$/, message: 'Must be a valid domain' },
      },
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
  forms: { robotForm: { ...formDefaults.robotForm } },
  formValidation,
  setFormStatus: (status) => set(() => ({ launchedForm: status })),
  toggleFormDefaultFill: (formName) => {
    const newDefaults = get().formDefaultFill
      ? {}
      : { forms: { [formName]: { ...formDefaults[formName] } } };

    set((state) => ({
      ...newDefaults,
      formDefaultFill: !state.formDefaultFill,
    }));
  },
  resetFormProgress: (formName) => {
    if (formName)
      set(() => ({
        forms: { [formName]: { ...formDefaults[formName] } },
        page: 0,
      }));
  },
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

  jumpPages: (formName, data, pageNumber) => {
    console.log(`zustand: jumpPages`, data);
    set(
      produce((draft) => {
        Object.keys(data).map((field) => {
          const fieldValue = data[field];
          return (draft.forms[formName][field] = fieldValue);
        });
        draft.page = pageNumber;
      })
    );
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

            // console.table(`onSubmit mapping:`, { category, field, fieldValue });
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
  readFormCategory: (formName, categoryName) => {
    return get().forms[formName][categoryName];
  },
  // readFormCategoryValue as written bellow is the same as object[key] (i.e. completely redundant). categoryName is actually an object. It would only have value as a function if categoryName was actually a string.
  // readFormCategoryValue: (categoryName, key) => {
  //   // console.count(`readFormCategoryValue invoked`);
  //   return categoryName[key] ?? '';
  // },
  readFormCategoryValue: (formName, categoryName, key) => {
    return get().forms[formName][categoryName][key] ?? '';
  },
  // formCategory = "robotFormBasic"
  convertFormTocToSchema: (formName, formCategory) => {
    return get().forms[formName][`${formName}Schema`][formCategory];
  },

  readFormValidation: (formName, formCategory, formField, subfield = null) => {
    const inputValidation =
      get().formValidation[formName][formCategory][formField][subfield] ||
      get().formValidation[formName][formCategory][formField];

    return inputValidation;
  },
}));

export default useFormStore;
