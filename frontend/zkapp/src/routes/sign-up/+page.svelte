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
  
  
  <Card class="mb-3 border-0 p-3">   
    <CardBody>
      <CardText>
        <Alert color='info'>
          Your email is not registered. Please sign up first.
        </Alert>
      </CardText>
      <Form class='w-100'>
        <FormGroup class='d-flex flex-column w-100 gap-2'>
          <Input
          class='p-3'
          type="email"
          name="email"
          id="Email"
          placeholder="Email"
          />

          <Input
          class='p-3'
          type="fullname"
          name="fullname"
          id="Fullname"
          placeholder="Full name"
          />
          <Button  size="md"
          href="/code"
          class="px-3 py-2 rounded-3 bg-primary text-white border-0">Sign up</Button>
        </FormGroup>
      </Form>
     
    </CardBody>
  </Card>
  
  
  
</Section >