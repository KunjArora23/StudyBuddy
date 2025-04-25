import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function Auth() {
 const {loginData, signupData,  onSubmitHandler, onChangeHandler }=useContext(AuthContext)
 const navigate=useNavigate()
  return (
    
    <div className="w-[98vw] flex  justify-center h-[85vh] mt-2">
     
        <Tabs  defaultValue="login" className="w-[400px] flex flex-col justify-center items-center">
       <TabsList className="grid w-full grid-cols-2 relative z-10">
          <TabsTrigger value="signup">SignUp</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup" className="mt-4 "> 
          <Card className="w-[25rem ]">
            <CardHeader>
              <CardTitle>SignUp</CardTitle>
              <CardDescription>
                Enter your details to create your account. Click on SignUp when
                you are done
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  name="name"
                  value={signupData.name}
                  onChange={(e) => onChangeHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  name="email"
                  value={signupData.email}
                  onChange={(e) => onChangeHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  name="password"
                  value={signupData.password}
                  onChange={(e) => onChangeHandler(e, "signup")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={(e) => onSubmitHandler(e, "signup",navigate)} className="cursor-pointer">
                SignUp
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card className="w-[25rem]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your details to Login in your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  value={loginData.email}
                  onChange={(e) => onChangeHandler(e, "login")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => onChangeHandler(e, "login")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={(e) => onSubmitHandler(e, "login",navigate)} className="cursor-pointer">
                Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default Auth;
