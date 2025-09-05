
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRight, LogIn, UserPlus, Mail, Lock } from 'lucide-react';

interface FormValues {
  email: string;
  password: string;
}

const LoginBox = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleAuth = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (isSigningUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        toast.success("Sign up successful! Please check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        toast.success("Login successful!");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <Card className="w-full max-w-md bg-[#0e1a2e]/90 backdrop-blur-sm border-[#1e375f] shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-2xl md:text-3xl font-medium tracking-wide text-[#3a9edc]">
            {isSigningUp ? 'Join the COSMOS' : 'Enter the COSMOS'}
          </CardTitle>
          <CardDescription className="text-center text-[#8fbad5] text-sm md:text-base">
            {isSigningUp 
              ? 'Create your account to explore the cosmic depths' 
              : 'Enter your credentials to continue your stellar journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#8fbad5]">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#406c8e]" />
                        <Input 
                          placeholder="Enter your email" 
                          className="pl-10 bg-[#0a1628] border-[#1e375f] focus:border-[#3a9edc] text-gray-200"
                          {...field} 
                          disabled={isLoading} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#f07878]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#8fbad5]">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#406c8e]" />
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="pl-10 bg-[#0a1628] border-[#1e375f] focus:border-[#3a9edc] text-gray-200"
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#f07878]" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#1e82f7] to-[#37a587] hover:opacity-90 transition-opacity font-medium tracking-wide mt-2 cosmic-login-btn"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : (
                    <span className="flex items-center justify-center gap-2">
                      {isSigningUp ? 'Sign Up' : 'Sign In'} 
                      <LogIn size={18} />
                    </span>
                  )
                }
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            variant="ghost" 
            onClick={() => setIsSigningUp(!isSigningUp)} 
            disabled={isLoading}
            className="text-[#3a9edc] hover:text-[#5ab5e6] hover:bg-[#152238] transition-colors"
          >
            <span className="flex items-center gap-2">
              {isSigningUp 
                ? 'Already have an account? Sign In' 
                : 'Need an account? Sign Up'}
              <ArrowRight size={16} />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginBox;
