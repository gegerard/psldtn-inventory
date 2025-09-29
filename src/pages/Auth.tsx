import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters')
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      const error = result.error;
      
      if (!error) {
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in.'
        });
        navigate('/');
      } else {
        toast({
          title: 'Authentication Error',
          description: error.message,
          variant: 'destructive'
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Welcome back! Please sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email" 
                        {...field} 
                        disabled={loading}
                        className="h-11 text-base"
                        autoComplete="email"
                        autoCapitalize="none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your password" 
                        {...field} 
                        disabled={loading}
                        className="h-11 text-base"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 text-base font-medium mt-6" disabled={loading}>
                {loading ? 'Please wait...' : 'Sign In'}
              </Button>
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;