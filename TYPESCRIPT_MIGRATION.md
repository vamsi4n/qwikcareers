# TypeScript Migration Guide

## ✅ Completed

### 1. TypeScript Setup
- ✅ Installed TypeScript and type definitions (@types/react, @types/react-dom, @types/react-router-dom)
- ✅ Created `tsconfig.json` with strict type checking
- ✅ Created `tsconfig.node.json` for Vite configuration

### 2. Type Definitions
- ✅ Created comprehensive type definitions in `/frontend/src/types/index.ts`:
  - User, Job, Application, Company interfaces
  - JobSeekerProfile with Experience, Education, Certification
  - Redux state types (AuthState, JobState, ApplicationState, etc.)
  - API response types (ApiResponse, PaginatedResponse)
  - Component prop types (AnimatedCardProps, GlassCardProps)
  - Form data types (LoginFormData, RegisterFormData, etc.)

### 3. Converted Files
- ✅ `/frontend/src/utils/animations.ts` - Added TypeScript interfaces
- ✅ `/frontend/src/hooks/useScrollAnimation.ts` - Full TypeScript conversion with proper return types
- ✅ `/frontend/src/components/ui/GlassCard.tsx` - React component with TypeScript props
- ✅ `/frontend/src/components/animations/AnimatedCard.tsx` - React component with type-safe props

## 📋 Remaining Work

### Priority 1: Core Redux Store
Convert all Redux slices to TypeScript:
- `store/slices/authSlice.js` → `authSlice.ts`
- `store/slices/jobSlice.js` → `jobSlice.ts`
- `store/slices/applicationSlice.js` → `applicationSlice.ts`
- `store/slices/companySlice.js` → `companySlice.ts`
- `store/slices/userSlice.js` → `userSlice.ts`
- `store/index.js` → `index.ts`

**Example Redux Slice Conversion:**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginFormData } from '../../types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null
};

export const login = createAsyncThunk<
  { user: User; token: string },
  LoginFormData,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

### Priority 2: Pages
Convert page components to TypeScript:
- All dashboard pages (`DashboardPage.jsx` → `DashboardPage.tsx`)
- Job pages (`JobSearchPage.jsx`, `JobDetailsPage.jsx`, etc.)
- Application pages
- Profile pages
- Authentication pages

**Example Page Component:**
```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Job } from '../../types';

const JobSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs, isLoading } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    // Fetch jobs
  }, [dispatch]);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default JobSearchPage;
```

### Priority 3: Remaining Components
- Animation components (`FloatingElements.jsx`, `AnimatedSection.jsx`)
- UI components (`GradientBackground.jsx`)
- Layout components
- Module-specific components

### Priority 4: Services & API
Convert API service files:
- `services/api.js` → `api.ts`
- Add type-safe API response handling

**Example API Service:**
```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data);
    return response.data;
  }

  // Additional methods...
}

export default new ApiService();
```

## 🔄 Migration Process

### Step-by-Step Guide

1. **Rename Files**: Change `.js` to `.ts` or `.jsx` to `.tsx`
   ```bash
   mv component.jsx component.tsx
   ```

2. **Add Imports**: Import React and types
   ```typescript
   import React from 'react';
   import { YourType } from '../../types';
   ```

3. **Define Props Interface**: For React components
   ```typescript
   interface ComponentProps {
     prop1: string;
     prop2?: number;
     onClick?: () => void;
     children?: React.ReactNode;
   }
   ```

4. **Add Type Annotations**: To function parameters and returns
   ```typescript
   const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
     const [state, setState] = useState<string>('');
     return <div>{prop1}</div>;
   };
   ```

5. **Handle Events**: Use React event types
   ```typescript
   const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
     // Handle click
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setValue(e.target.value);
   };
   ```

6. **Use Typed Selectors**: With Redux
   ```typescript
   const user = useSelector((state: RootState) => state.auth.user);
   ```

## 🛠️ Common TypeScript Patterns

### useState with types
```typescript
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Job[]>([]);
```

### useEffect
```typescript
useEffect(() => {
  // Effect code
}, [dependency]); // TypeScript infers dependency types
```

### Event Handlers
```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
};
```

### Async Functions
```typescript
const fetchData = async (): Promise<void> => {
  try {
    const data = await api.get<Job[]>('/jobs');
    setJobs(data);
  } catch (error) {
    console.error(error);
  }
};
```

## ⚠️ Common Issues & Solutions

### Issue: "Property does not exist on type"
**Solution**: Define proper interface or use type assertion
```typescript
interface CustomEvent extends Event {
  customProperty: string;
}
```

### Issue: "Type 'null' is not assignable"
**Solution**: Use union types
```typescript
const [data, setData] = useState<Data | null>(null);
```

### Issue: "Argument of type 'string' is not assignable to parameter of type 'never'"
**Solution**: Explicitly type the array
```typescript
const items: string[] = [];
```

## 📊 Migration Progress Tracking

### Total Files by Category
- ✅ Utility Files: 2/2 (100%)
- ✅ Hooks: 1/1 (100%)
- ✅ UI Components: 2/2 (100%)
- ⏳ Redux Slices: 0/6 (0%)
- ⏳ Pages: 0/30+ (0%)
- ⏳ Services: 0/5 (0%)
- ⏳ Other Components: 0/20+ (0%)

## 🎯 Benefits After Migration

1. **Type Safety**: Catch errors at compile time
2. **Better IntelliSense**: Improved autocomplete in IDEs
3. **Refactoring Confidence**: Safe code modifications
4. **Documentation**: Types serve as inline documentation
5. **Maintainability**: Easier to understand code structure
6. **Error Prevention**: Reduce runtime errors significantly

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Redux Toolkit TypeScript](https://redux-toolkit.js.org/usage/usage-with-typescript)

## 🚀 Next Steps

1. Convert Redux store (highest priority)
2. Convert 5-10 page components
3. Run type checking: `npm run type-check` (add to package.json)
4. Fix any type errors
5. Continue iterative conversion
6. Update build scripts to use TypeScript
7. Enable stricter TypeScript rules gradually

---

**Note**: This is a gradual migration. The codebase can run with mixed JS/TS files. Focus on high-value conversions first (Redux store, frequently used components).
