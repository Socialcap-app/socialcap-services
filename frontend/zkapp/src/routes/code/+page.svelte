<script>
    import { onMount } from "svelte";
    import { Spinner, Icon, TabContent, TabPane, Button,
    Form,
    Input,
    FormGroup,
    Label,
      Card,
      CardBody,
      CardFooter,
      CardHeader,
      CardSubtitle,
      CardText,
      CardTitle,
      NavbarBrand,
      Alert,
    
    } from 'sveltestrap';
    import Section from '@components/Section.svelte';
  
  </script>
  
<section class='bg-image z-n1 position-absolute opacity-50'  style="background-image: url('/img/svg/socialcap-bg-signin.svg');
height: 100vh; width: 100vw; backgroundRepeat: no-repeat; backgroundSize: auto;">

  <!-- <img alt="Socialcap logo" src="/img/svg/socialcap-bg-signin.svg" /> -->
</section>
<Section class='w-25 text-center h-100 d-flex flex-column justify-content-center'>
      
    <NavbarBrand class="w-auto m-4" href="/">
      <img alt="Socialcap logo" src="/img/socialcap/socialcap-logo-blue.svg" />
    </NavbarBrand>
    
    
    <Card class="mb-3">
     
      <CardBody>
        <CardText>
         Check your email for the code
        </CardText>
        <Form class='w-100'>
            <FormGroup class='d-flex flex-column w-100 gap-3'>
                <Input
            type="text"
            class='p-3'
            maxlength="6" 
            oninput="this.value=this.value.replace(/[^0-9]/g,'');"
            name="code"
            id="Code"
            placeholder="Enter 6 digit code"
            />
  
          
            <Button  size="md"
            href="/"
            class="px-3 py-2 rounded-3 bg-primary text-white border-0">Sign in</Button>
          </FormGroup>
        </Form>
       
      </CardBody>
    </Card>
    
    
    
  </Section >